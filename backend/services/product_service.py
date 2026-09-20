import os
from typing import List, Optional
from schemas import Product
from services.mock_store_service import mock_store_service
from services.shopify_service import shopify_service

class ProductService:
    def is_mock_mode(self) -> bool:
        return os.getenv("MOCK_STORE", "true").lower() != "false"

    async def get_products(self) -> List[Product]:
        if self.is_mock_mode():
            return mock_store_service.get_all_products()
        try:
            return await shopify_service.fetch_products_from_graphql()
        except Exception as e:
            print(f"Shopify GraphQL fetch failed, fallback to mock store: {e}")
            return mock_store_service.get_all_products()

    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        products = await self.get_products()
        return next((p for p in products if p.id == product_id), None)

    async def search_products(self, query: str = "", category: Optional[str] = None, color: Optional[str] = None, size: Optional[str] = None) -> List[Product]:
        if self.is_mock_mode():
            return mock_store_service.search_products(query, category, color, size)
        try:
            prods = await shopify_service.fetch_products_from_graphql(query)
            if prods:
                return prods
            return mock_store_service.search_products(query, category, color, size)
        except Exception:
            return mock_store_service.search_products(query, category, color, size)

product_service = ProductService()
