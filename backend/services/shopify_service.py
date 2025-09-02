from dotenv import load_dotenv
import requests
import os
load_dotenv() 
SHOPIFY_STORE = os.getenv("SHOPIFY_STORE_URL")
SHOPIFY_ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

BASE_URL = f"https://{SHOPIFY_STORE}/admin/api/2025-01"  # API version

def get_headers():
    return {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
    }

def get_products(limit=10):
    """Fetch products from Shopify store"""
    url = f"{BASE_URL}/products.json?limit={limit}"
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json().get("products", [])

def create_product(product_data: dict):
    """Create a new product in Shopify"""
    url = f"{BASE_URL}/products.json"
    response = requests.post(url, headers=get_headers(), json={"product": product_data})
    response.raise_for_status()
    return response.json().get("product")

def update_product(product_id: str, product_data: dict):
    """Update an existing product"""
    url = f"{BASE_URL}/products/{product_id}.json"
    response = requests.put(url, headers=get_headers(), json={"product": product_data})
    response.raise_for_status()
    return response.json().get("product")

def get_product(product_id: str):
    """Fetch a single product from Shopify by ID"""
    url = f"{BASE_URL}/products/{product_id}.json"
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json().get("product")

def delete_product(product_id: str):
    """Delete a product from Shopify"""
    url = f"{BASE_URL}/products/{product_id}.json"
    response = requests.delete(url, headers=get_headers())
    response.raise_for_status()
    return {"deleted": product_id}
