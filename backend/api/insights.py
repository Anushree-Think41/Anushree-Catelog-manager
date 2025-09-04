from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
import json
import uuid
import asyncio
import traceback

from backend.db.database import get_db
from backend.db.models import Product, OptimizedProduct as OptimizedProductModel
from sqlalchemy.orm import Session

from catalog_agent.agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types # Import types
from backend.services.groq_service import GroqService


class OptimizedProduct(BaseModel):
    id: int
    original_product_id: int
    title: str
    description: str
    price: float
    sku: str
    tags: str
    shopify_id: str

groq_service = GroqService()


router = APIRouter()
product_insights_cache: Dict[int, Any] = {}

# Session + Runner
session_service = InMemorySessionService()
root_agent_runner = Runner(
    agent=root_agent,
    app_name="catalog_manager_app",
    session_service=session_service,
)


@router.post("/product-insights")
async def get_product_insights(product: OptimizedProduct):
    """
    Receives product details from the frontend and triggers insight generation.
    """
    print(f"Received product for insights: {product.title}")
    print("--- Starting agent execution ---")

    try:
        # Formulate agent query
        agent_query = (
            f"Analyze the product: Title: {product.title}, Description: {product.description}, "
            f"Tags: {product.tags}. Find competitor insights and keyword suggestions based on this product. "
            f"Return the insights in a structured JSON format including 'competitor_insights' "
            f"(list of objects with name, product_url, features) and 'keyword_suggestions' (list of strings)."
        )
        print(f"Agent query: {agent_query}")

        session_id = f"product_insight_{product.id}_{uuid.uuid4()}"
        user_id = "product_insights_user"

        # Explicitly create the session before running the agent
        await session_service.create_session(
            user_id=user_id,
            session_id=session_id,
            app_name="catalog_manager_app" # Must match the app_name used in Runner
        )

        # Call the root_agent via the runner, running the synchronous generator in a thread
        full_agent_response = []
        # Use asyncio.to_thread to run the synchronous generator in a separate thread
        # Then iterate over the results synchronously within the async function
        for event in await asyncio.to_thread(
            root_agent_runner.run,
            user_id=user_id,
            session_id=session_id,
            new_message=types.Content(parts=[types.Part(text=agent_query)]) # Wrap agent_query in types.Content
        ):
            if event.type == "response.output_text.delta":
                full_agent_response.append(event.delta)
        
        agent_response = "".join(full_agent_response)

        print("--- Agent execution completed ---")
        print(f"Raw agent response: {agent_response}")

        # Attempt to parse the agent's response as JSON
        try:
            insights_data = json.loads(agent_response)
            print("Agent response successfully parsed as JSON.")
        except json.JSONDecodeError as json_err:
            print(f"Warning: Agent response is not valid JSON. Error: {json_err}")
            # If not valid JSON, store the raw response
            insights_data = {"raw_agent_output": agent_response}

        # Store in cache
        product_insights_cache[product.id] = insights_data
        print(f"Insights stored for product ID: {product.id}")

        return {
            "message": "Product details received, insights generated",
            "product_id": product.id,
            "insights": insights,
        }

    except Exception as e:
        print(f"--- An unexpected error occurred during insight generation: {e} ---")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate insights: {str(e)}\nFull Traceback: {traceback.format_exc()}",
        )


@router.get("/product-insights/{product_id}")
async def get_product_insights_by_id(product_id: int):
    """
    Fetches generated insights for a specific product ID.
    """
    insights = product_insights_cache.get(product_id)
    if not insights:
        raise HTTPException(
            status_code=404,
            detail="Insights not found for this product ID. Please trigger generation first.",
        )
    return {"product_id": product_id, "insights": insights}


class ProductDescriptionRequest(BaseModel):
    description: str


@router.post("/groq-product-insights")
async def get_groq_product_insights(request: ProductDescriptionRequest):
    """
    Generates product insights using Groq based on the provided product description.
    """
    try:
        insights = groq_service.generate_product_insights(request.description)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Groq insights: {str(e)}")


@router.get("/product-comparison/{optimized_product_id}")
async def get_product_comparison(
    optimized_product_id: int,
    db: Session = Depends(get_db)
):
    """
    Compares an optimized product with its original version and provides scores.
    """
    optimized_product = db.query(OptimizedProductModel).filter(OptimizedProductModel.id == optimized_product_id).first()
    if not optimized_product:
        raise HTTPException(status_code=404, detail="Optimized product not found.")

    original_product = db.query(Product).filter(Product.id == optimized_product.original_product_id).first()
    if not original_product:
        raise HTTPException(status_code=404, detail="Original product not found for this optimized product.")

    try:
        print(f"Comparing products: original_id={original_product.id}, optimized_id={optimized_product.id}")
        comparison_insights = groq_service.compare_product_descriptions(
            original_description=original_product.description,
            optimized_description=optimized_product.description
        )
        print(f"Comparison insights generated successfully for optimized_product_id={optimized_product_id}")
        return {"optimized_product_id": optimized_product_id, "comparison": comparison_insights}
    except Exception as e:
        print(f"Error generating comparison: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate product comparison: {str(e)}")

@router.get("/product-details/{optimized_product_id}")
async def get_product_details(
    optimized_product_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetches the original and optimized product details.
    """
    optimized_product = db.query(OptimizedProductModel).filter(OptimizedProductModel.id == optimized_product_id).first()
    if not optimized_product:
        raise HTTPException(status_code=404, detail="Optimized product not found.")

    original_product = db.query(Product).filter(Product.id == optimized_product.original_product_id).first()
    if not original_product:
        raise HTTPException(status_code=404, detail="Original product not found for this optimized product.")

    return {
        "original_product": {
            "title": original_product.title,
            "description": original_product.description,
            "price": original_product.price,
            "sku": original_product.sku,
            "tags": original_product.tags,
        },
        "optimized_product": {
            "title": optimized_product.title,
            "description": optimized_product.description,
            "price": optimized_product.price,
            "sku": optimized_product.sku,
            "tags": optimized_product.tags,
        },
    }

@router.get("/overall-product-comparison-summary")
async def get_overall_product_comparison_summary(db: Session = Depends(get_db)):
    """
    Calculates the average overall comparison scores for all optimized products.
    """
    optimized_products = db.query(OptimizedProductModel).all()
    
    total_original_overall_score = 0
    total_optimized_overall_score = 0
    total_seo_keyword_richness = 0
    total_clarity_readability = 0
    total_persuasiveness = 0
    total_uniqueness = 0
    total_best_practices = 0
    compared_products_count = 0

    for optimized_product in optimized_products:
        original_product = db.query(Product).filter(Product.id == optimized_product.original_product_id).first()
        
        if original_product:
            try:
                comparison_insights = groq_service.compare_product_descriptions(
                    original_description=original_product.description,
                    optimized_description=optimized_product.description
                )
                overall_score = comparison_insights.get("overall_score")
                if overall_score:
                    total_original_overall_score += overall_score.get("original", 0)
                    total_optimized_overall_score += overall_score.get("optimized", 0)
                    
                    # Accumulate individual metric scores
                    total_seo_keyword_richness += comparison_insights.get("seo_keyword_richness", 0)
                    total_clarity_readability += comparison_insights.get("clarity_readability", 0)
                    total_persuasiveness += comparison_insights.get("persuasiveness", 0)
                    total_uniqueness += comparison_insights.get("uniqueness", 0)
                    total_best_practices += comparison_insights.get("best_practices", 0)

                    compared_products_count += 1
            except Exception as e:
                print(f"Error comparing product {optimized_product.id}: {e}")
                # Continue to next product even if one fails

    if compared_products_count == 0:
        return {
            "average_original_overall_score": 0,
            "average_optimized_overall_score": 0,
            "average_seo_keyword_richness": 0,
            "average_clarity_readability": 0,
            "average_persuasiveness": 0,
            "average_uniqueness": 0,
            "average_best_practices": 0,
            "message": "No products found for comparison or all comparisons failed."
        }

    average_original_overall_score = total_original_overall_score / compared_products_count
    average_optimized_overall_score = total_optimized_overall_score / compared_products_count
    average_seo_keyword_richness = total_seo_keyword_richness / compared_products_count
    average_clarity_readability = total_clarity_readability / compared_products_count
    average_persuasiveness = total_persuasiveness / compared_products_count
    average_uniqueness = total_uniqueness / compared_products_count
    average_best_practices = total_best_practices / compared_products_count

    return {
        "average_original_overall_score": round(average_original_overall_score, 2),
        "average_optimized_overall_score": round(average_optimized_overall_score, 2),
        "average_seo_keyword_richness": round(average_seo_keyword_richness, 2),
        "average_clarity_readability": round(average_clarity_readability, 2),
        "average_persuasiveness": round(average_persuasiveness, 2),
        "average_uniqueness": round(average_uniqueness, 2),
        "average_best_practices": round(average_best_practices, 2),
        "compared_products_count": compared_products_count
    }
