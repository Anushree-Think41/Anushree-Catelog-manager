import asyncio
import uuid
from .product_optimizer_agent import optimize_product
from backend.db.database import get_db
from backend.services.product_service import get_all_products, create_optimized_product
from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from google.adk.sessions.session import Session
from google.adk.tools.tool_context import ToolContext
from google.adk.agents import LlmAgent
from google.genai import types

async def optimize_all_products():
    """
    Fetches all products from the database, optimizes them, and creates optimized entries.
    """
    print("Starting product optimization...")

    # 1. Create InvocationContext and ToolContext (still needed for optimize_product)
    session_service = InMemorySessionService()
    session = Session(
        id=str(uuid.uuid4()),
        app_name="all_products_optimizer",
        user_id="test_user",
    )
    context_agent = LlmAgent(name="context_agent")

    invocation_context = InvocationContext(
        invocation_id=new_invocation_context_id(),
        agent=context_agent,
        session_service=session_service,
        session=session,
        user_content=types.Content(),
    )
    tool_context = ToolContext(invocation_context)

    db = next(get_db())
    try:
        products = get_all_products(db)
        print(f"Found {len(products)} products to optimize.")

        for product in products:
            print(f"Optimizing product: {product.title}")
            product_input = {
                "title": product.title,
                "description": product.description,
                "tags": product.tags,
            }

            optimized_data = await optimize_product(product_input)

            if "error" not in optimized_data:
                if product.id:
                    create_optimized_product(db, product, optimized_data)
                    print(f"Successfully optimized and created entry for product ID: {product.id}")
                else:
                    print("Product ID not found, cannot optimize.")
            else:
                print(f"Failed to optimize product ID {product.id}: {optimized_data['error']}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(optimize_all_products())
