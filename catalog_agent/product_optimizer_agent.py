import json
from pathlib import Path
import asyncio
import uuid
from pydantic import BaseModel
import google.generativeai as genai
import os

# Define the input schema for the product
class ProductInput(BaseModel):
    title: str
    description: str
    tags: str
    category: str | None = None
    seoFocus: str | None = None
    writingTone: str | None = None

# Load prompt
PROMPT_PATH = Path(__file__).parent / "prompts/optimizer_prompt.txt"
with open(PROMPT_PATH, "r") as f:
    OPTIMIZER_PROMPT = f.read()

async def optimize_product(product: dict, category: str | None = None, seo_focus: str | None = None, writing_tone: str | None = None) -> dict:
    """
    Optimizes product using Gemini API directly.
    """
    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY:
        return {"error": "GEMINI_API_KEY environment variable not set."}

    genai.configure(api_key=API_KEY)

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Construct the prompt with product details and new parameters
        full_prompt = f"{OPTIMIZER_PROMPT}\n\nProduct: {json.dumps(product)}"
        if category:
            full_prompt += f"\nCategory: {category}"
        if seo_focus:
            full_prompt += f"\nSEO Focus: {seo_focus}"
        if writing_tone:
            full_prompt += f"\nWriting Tone: {writing_tone}"

        retries = 5
        delay = 10  # seconds

        for i in range(retries):
            try:
                response = await model.generate_content_async(full_prompt)
                if response.text:
                    output_text = response.text.strip()

                    # Strip ```json``` wrappers if present
                    if output_text.startswith("```"):
                        output_text = output_text.split("```json")[-1].split("```")[0].strip()

                    try:
                        return json.loads(output_text)
                    except json.JSONDecodeError:
                        return {"error": "Failed to parse JSON", "raw_output": output_text}
                else:
                    return {"error": "Gemini API returned no text response."}
            except Exception as e:
                if "ResourceExhausted" in str(e) and i < retries - 1:
                    print(f"Rate limit hit. Retrying in {delay} seconds...")
                    await asyncio.sleep(delay)
                    delay *= 2  # Exponential backoff
                else:
                    return {"error": f"Error optimizing product with Gemini API: {e}"}

    except Exception as e:
        return {"error": f"Error optimizing product with Gemini API: {e}"}
