import os
from typing import List, Optional
import httpx
from schemas import Product, ProductVariant

class ShopifyService:
    def __init__(self):
        self.domain = os.getenv("SHOPIFY_STORE_DOMAIN", "")
        self.token = os.getenv("SHOPIFY_ACCESS_TOKEN", "")
        self.api_version = os.getenv("SHOPIFY_API_VERSION", "2024-04")

    async def fetch_products_from_graphql(self, query_str: Optional[str] = None) -> List[Product]:
        if not self.domain or not self.token:
            raise ValueError("Shopify store domain or access token not configured in backend environment.")

        endpoint = f"https://{self.domain}/admin/api/{self.api_version}/graphql.json"

        graphql_payload = {
            "query": """
                query getProducts($query: String) {
                  products(first: 20, query: $query) {
                    edges {
                      node {
                        id
                        title
                        description
                        productType
                        vendor
                        tags
                        createdAt
                        featuredImage { url }
                        variants(first: 10) {
                          edges {
                            node {
                              id
                              title
                              price
                              compareAtPrice
                              sku
                              inventoryQuantity
                              selectedOptions { name value }
                            }
                          }
                        }
                      }
                    }
                  }
                }
            """,
            "variables": {"query": query_str}
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                endpoint,
                headers={
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": self.token
                },
                json=graphql_payload,
                timeout=10.0
            )

        if resp.status_code != 200:
            raise RuntimeError(f"Shopify GraphQL returned status {resp.status_code}: {resp.text}")

        data = resp.json()
        if "errors" in data:
            raise RuntimeError(f"Shopify GraphQL errors: {data['errors']}")

        edges = data.get("data", {}).get("products", {}).get("edges", [])
        products = []

        for edge in edges:
            node = edge["node"]
            variants = []
            for v_edge in node.get("variants", {}).get("edges", []):
                v_node = v_edge["node"]
                options = {o["name"].lower(): o["value"] for o in v_node.get("selectedOptions", [])}
                qty = v_node.get("inventoryQuantity", 10)
                variants.append(ProductVariant(
                    id=v_node["id"],
                    title=v_node["title"],
                    price=float(v_node.get("price", 0.0)),
                    compareAtPrice=float(v_node["compareAtPrice"]) if v_node.get("compareAtPrice") else None,
                    sku=v_node.get("sku", ""),
                    inventoryQuantity=qty,
                    size=options.get("size"),
                    color=options.get("color"),
                    available=qty > 0
                ))

            img_url = node.get("featuredImage", {}).get("url") if node.get("featuredImage") else "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            products.append(Product(
                id=node["id"],
                title=node["title"],
                description=node.get("description", ""),
                category=node.get("productType") or "Footwear",
                tags=node.get("tags", []),
                vendor=node.get("vendor", "Shopify Store"),
                variants=variants,
                image=img_url,
                createdAt=node.get("createdAt", "")
            ))

        return products

shopify_service = ShopifyService()
