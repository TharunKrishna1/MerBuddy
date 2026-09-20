"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productNormalizer = exports.ProductNormalizer = void 0;
class ProductNormalizer {
    /**
     * Converts product database objects into compact, structured LLM context string
     */
    normalizeForLLM(products) {
        if (!products || products.length === 0) {
            return 'No matching products found in store database.';
        }
        return products.map(p => {
            const variantLines = p.variants.map(v => {
                const stockStr = v.inventoryQuantity > 0 ? `${v.inventoryQuantity} in stock` : 'OUT OF STOCK';
                const colorStr = v.color ? `Color: ${v.color}` : '';
                const sizeStr = v.size ? `Size: ${v.size}` : '';
                return `  - Variant: ${v.title} | Price: ₹${v.price.toLocaleString('en-IN')} | ${colorStr} ${sizeStr} | Status: ${stockStr}`;
            }).join('\n');
            return `Product ID: ${p.id}\nTitle: ${p.title}\nCategory: ${p.category}\nVendor: ${p.vendor}\nVariants:\n${variantLines}`;
        }).join('\n\n');
    }
}
exports.ProductNormalizer = ProductNormalizer;
exports.productNormalizer = new ProductNormalizer();
