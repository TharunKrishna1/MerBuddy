from typing import List
from schemas import Product

class ProductNormalizer:
    def normalize_for_llm(self, products: List[Product]) -> str:
        if not products:
            return "No matching products found in store database."

        blocks = []
        for p in products:
            variant_lines = []
            for v in p.variants:
                stock_str = f"{v.inventoryQuantity} in stock" if v.inventoryQuantity > 0 else "OUT OF STOCK"
                color_str = f"Color: {v.color}" if v.color else ""
                size_str = f"Size: {v.size}" if v.size else ""
                variant_lines.append(f"  - Variant: {v.title} | Price: ₹{int(v.price):,} | {color_str} {size_str} | Status: {stock_str}")

            variants_text = "\n".join(variant_lines)
            blocks.append(f"Product ID: {p.id}\nTitle: {p.title}\nCategory: {p.category}\nVendor: {p.vendor}\nVariants:\n{variants_text}")

        return "\n\n".join(blocks)

product_normalizer = ProductNormalizer()
