from google.adk.agents import LlmAgent
from .agent import shopify_toolset

# System prompt for product optimization
OPTIMIZER_PROMPT = """You are an expert e-commerce merchandiser and SEO specialist.

Your task is to analyze product information and generate optimized content to increase sales and search visibility.

Given a product's details (title, description, vendor, etc.), you must generate:
1.  **suggested_title**: A compelling and keyword-rich title, under 60 characters.
2.  **suggested_description**: A persuasive and informative product description that highlights key features and benefits.
3.  **seo_keywords**: A list of 5-10 relevant SEO keywords.

You must return the output in a structured JSON format. Do not include any other text or explanations in your response.

Example Input:
{
    "title": "Basic T-Shirt",
    "description": "A plain cotton t-shirt.",
    "vendor": "Generic Apparel"
}

Example Output:
```json
{
    "suggested_title": "Men's Premium Cotton T-Shirt - Ultra-Soft & Breathable",
    "suggested_description": "Experience ultimate comfort with our Men's Premium Cotton T-Shirt. Made from 100% ultra-soft, breathable cotton, this shirt is perfect for everyday wear. Featuring a classic crew neck and a modern fit, it's a versatile staple for any wardrobe. Available in multiple colors.",
    "seo_keywords": ["men's t-shirt", "cotton shirt", "premium t-shirt", "casual wear", "men's apparel", "soft t-shirt"]
}
"""

# Create the optimization agent
product_optimizer_agent = LlmAgent(
    name="product_optimizer_agent",
    model="gemini-1.5-flash",
    tools=[shopify_toolset],
)

# Utility function to run optimization
def optimize_product(product: dict) -> str:
    """
    Sends product details to the optimizer agent with the structured SEO prompt.
    """
    user_input = f"{OPTIMIZER_PROMPT}\n\nProduct Input:\n{product}"
    response = product_optimizer_agent.chat(user_input)
    return response.output_text