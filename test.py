import requests

# Replace with your store and API token
SHOPIFY_STORE = "dhxgzs-yp.myshopify.com"
ACCESS_TOKEN = "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"

url = f"https://{SHOPIFY_STORE}/admin/api/2025-01/products.json"

headers = {
    "X-Shopify-Access-Token": ACCESS_TOKEN,
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    products = response.json().get("products", [])
    print(f"✅ Connected! Found {len(products)} products.")
    for p in products[:5]:  # show first 5 products
        print(f"- {p['title']} (ID: {p['id']})")
else:
    print(f"❌ Error {response.status_code}: {response.text}")
