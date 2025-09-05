from backend.db.database import get_db
from backend.services import product_service
from backend.services.shopify_service import ShopifyService
from catalog_agent.product_optimizer_agent import optimize_product as run_optimization
from google.adk.tools.function_tool import FunctionTool
import asyncio
from backend.services.product_service import create_optimized_product

# Initialize services
shopify_service = ShopifyService()

class ProductTools:
    def get_original_product_details(self, product_id: int) -> dict:
        """
        Gets details of an original product by its ID.
        Args:
            product_id: The ID of the original product.
        Returns:
            A dictionary containing the product details, or an error message.
        """
        db = next(get_db())
        try:
            product = product_service.get_product_by_id(db, product_id)
            if product:
                return {
                    "id": product.id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                    "sku": product.sku,
                    "tags": product.tags,
                    "shopify_id": product.shopify_id
                }
            return {"error": f"Original product with ID {product_id} not found."}
        finally:
            db.close()

    def get_optimized_product_details(self, product_id: int) -> dict:
        """
        Gets details of an optimized product by its ID.
        Args:
            product_id: The ID of the optimized product.
        Returns:
            A dictionary containing the optimized product details, or an error message.
        """
        db = next(get_db())
        try:
            product = product_service.get_optimized_product_by_id(db, product_id)
            if product:
                return {
                    "id": product.id,
                    "original_product_id": product.original_product_id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                    "sku": product.sku,
                    "tags": product.tags,
                    "shopify_id": product.shopify_id
                }
            return {"error": f"Optimized product with ID {product_id} not found."}
        finally:
            db.close()

    async def optimize_product(self, product_data: dict, category: str = None, seo_focus: str = None, writing_tone: str = None) -> dict:
        """
        Optimizes a product's title, description, and tags based on provided criteria.
        Args:
            product_data: A dictionary containing the product's current title, description, and tags.
            category: Optional category for optimization (e.g., 'electronics', 'fashion').
            seo_focus: Optional SEO focus (e.g., 'long-tail keywords', 'brand visibility').
            writing_tone: Optional writing tone (e.g., 'formal', 'casual', 'persuasive').
        Returns:
            A dictionary containing the optimized product data, or an error message.
        """
        db = next(get_db()) # Get DB session
        try:
            optimized_data = await run_optimization(product_data, category, seo_focus, writing_tone)
            print(optimized_data)
            if "error" not in optimized_data:
                # Assuming product_data contains 'id' for the original product
                original_product_id = product_data.get("id") 
                if original_product_id:
                    print(f"Original product ID: {original_product_id}")
                    original_product = product_service.get_product_by_id(db, original_product_id)
                    if original_product:
                        print(f"Original product found: {original_product.title}")
                        print(f"Optimized data before saving: {optimized_data}")
                        # Save the optimized product to the database
                        # NOTE: This is redundant as the API endpoint already handles saving.
                        # This is added due to explicit user request.
                        create_optimized_product(db, original_product, optimized_data)
                        print(f"Re-optimized data saved to DB: {optimized_data}") # Print the re-optimized data
                        return {"status": "success", "optimized_data": optimized_data, "message": "Product optimized and saved to DB."} 
                    else:
                        return {"error": f"Original product with ID {original_product_id} not found for saving optimized data."} 
                else:
                    return {"error": "Original product ID not provided in product_data for saving optimized data."} 
            else:
                return optimized_data # Return the error from optimization
        except Exception as e:
            return {"error": f"Failed to optimize product: {e}"}
        finally:
            db.close()

    async def update_product_on_shopify(self, optimized_product_id: int) -> dict:
        """
        Updates an optimized product on Shopify using its Shopify ID.
        Args:
            optimized_product_id: The ID of the optimized product in the local database.
        Returns:
            A dictionary indicating success or failure.
        """
        db = next(get_db())
        try:
            optimized_product = product_service.get_optimized_product_by_id(db, optimized_product_id)

            if not optimized_product:
                return {"error": f"Optimized product with ID {optimized_product_id} not found in local DB."}
            if not optimized_product.shopify_id:
                return {"error": f"Optimized product with ID {optimized_product_id} does not have a Shopify ID."}

            product_data = {
                "title": optimized_product.title,
                "body_html": optimized_product.description,
                "variants": [
                    {
                        "price": str(optimized_product.price),
                        "sku": optimized_product.sku
                    }
                ],
                "tags": optimized_product.tags
            }
            
            # Ensure shopify_id is a string as expected by ShopifyService
            shopify_product_id_str = str(optimized_product.shopify_id)

            await shopify_service.update_product(shopify_product_id_str, product_data)
            return {"status": "success", "message": f"Product {optimized_product_id} updated on Shopify."}
        except Exception as e:
            return {"error": f"Failed to update product {optimized_product_id} on Shopify: {e}"}
        finally:
            db.close()

# Create instances of FunctionTool for each method
get_original_product_details_tool = FunctionTool(ProductTools().get_original_product_details)
get_optimized_product_details_tool = FunctionTool(ProductTools().get_optimized_product_details)
optimize_product_tool = FunctionTool(ProductTools().optimize_product)
update_product_on_shopify_tool = FunctionTool(ProductTools().update_product_on_shopify)
