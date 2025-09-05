import os
import json
from groq import Groq
from backend.utils.logger import logger # Import logger

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    def generate_product_insights(self, product_description: str) -> dict:
        prompt_content = (
            f"Generate concise and compelling marketing insights for the following product description: {product_description}. "
            f"Return the insights in a structured JSON format including: "
            f"'product_overview' (string), "
            f"'key_benefits' (list of strings), "
            f"'target_audience' (string), "
            f"'unique_selling_points' (list of strings), "
            f"'competitor_insights' (list of objects with name, product_url, features), "
            f"'keyword_suggestions' (list of strings), "
            f"'keyword_optimization_score' (integer from 0-100, based on keyword density and relevance), "
            f"'seo_friendliness_score' (integer from 0-100, based on description quality for search engines), "
            f"'overall_optimization_score' (integer from 0-100, overall assessment)."
        )
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt_content,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500, # Increased max_tokens to allow for more detailed JSON output
            response_format={"type": "json_object"} # Request JSON object output
        )
        raw_response = chat_completion.choices[0].message.content
        
        try:
            insights_data = json.loads(raw_response)
            return insights_data
        except json.JSONDecodeError:
            # If the model doesn't return valid JSON, return a fallback structure
            return {"raw_groq_output": raw_response, "error": "Groq did not return valid JSON."}

    def compare_product_descriptions(self, original_description: str, optimized_description: str) -> dict:
        prompt_content = (
            f"You are an expert in e-commerce SEO and product listing optimization. "
            f"Compare the following product details:\n\n"
            f"Original Product Details:\n"
            f"- Description: {original_description}\n\n"
            f"Optimized Product Details:\n"
            f"- Description: {optimized_description}\n\n"
            f"Your task:\n"
            f"1. Analyze how the optimized product details are better (or worse) than the original in terms of:"
            f"   - SEO keyword richness"
            f"   - Clarity and readability"
            f"   - Persuasiveness (conversion potential)"
            f"   - Uniqueness vs generic phrasing"
            f"   - Compliance with best practices for product listings (title length, keyword placement, etc.)\n\n"
            f"2. Assign a **numeric score (0–100)** for each metric above for both **Original** and **Optimized** versions.\n\n"
            f"3. Provide an **Overall SEO Impact Score (0–100)** showing how much more reach/visibility the optimized version is likely to achieve compared to the original.\n\n"
            f"4. Return results strictly in JSON format with the structure:\n"
            f"{{\n"
            f"  \"comparison\": {{\n"
            f"    \"seo_keyword_richness\": {{'original': number, 'optimized': number, 'insight': 'string'}},\n"
            f"    \"clarity_readability\": {{'original': number, 'optimized': number, 'insight': 'string'}},\n"
            f"    \"persuasiveness\": {{'original': number, 'optimized': number, 'insight': 'string'}},\n"
            f"    \"uniqueness\": {{'original': number, 'optimized': number, 'insight': 'string'}},\n"
            f"    \"best_practices\": {{'original': number, 'optimized': number, 'insight': 'string'}}\n"
            f"  }},\n"
            f"  \"overall_score\": {{'original': number, 'optimized': number, 'insight': 'string'}},\n"
            f"  \"conclusion\": 'string'\n"
            f"}}\n\n"
            f"Make sure the insights are **concise, actionable, and measurable**."
        )
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt_content,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000, # Increased max_tokens to allow for more detailed JSON output
            response_format={"type": "json_object"} # Request JSON object output
        )
        raw_response = chat_completion.choices[0].message.content
        
        try:
            insights_data = json.loads(raw_response)
            print(insights_data)
            return insights_data
        except json.JSONDecodeError:
            # If the model doesn't return valid JSON, return a fallback structure
            return {"raw_groq_output": raw_response, "error": "Groq did not return valid JSON."}

    def stream_chat_response(self, messages: list[dict[str, str]]):
        logger.info(f"Sending messages to Groq: {messages}")
        chat_completion = self.client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            stream=True,
        )
        for chunk in chat_completion:
            content = chunk.choices[0].delta.content or ""
            logger.info(f"Received chunk from Groq: {content}")
            yield content
