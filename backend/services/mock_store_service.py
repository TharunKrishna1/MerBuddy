from typing import List, Optional
from schemas import Product
from data.mock_products import mock_products

class MockStoreService:
    def __init__(self):
        self.products: List[Product] = mock_products

    def get_all_products(self) -> List[Product]:
        return self.products

    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        return next((p for p in self.products if p.id == product_id), None)

    def search_products(self, query: str = "", category: Optional[str] = None, color: Optional[str] = None, size: Optional[str] = None) -> List[Product]:
        q = query.lower().strip()
        results = []

        for p in self.products:
            match_text = f"{p.title} {p.description} {' '.join(p.tags)}".lower()
            matches_query = not q or q in match_text or q in p.category.lower()
            matches_category = not category or p.category.lower() == category.lower()

            matches_variant = True
            if color or size:
                matches_variant = any(
                    (not color or (v.color and v.color.lower() == color.lower())) and
                    (not size or (v.size and str(v.size) == str(size)))
                    for v in p.variants
                )

            if matches_query and matches_category and matches_variant:
                results.append(p)

        return results

mock_store_service = MockStoreService()
