import { Product } from '../types';
import { mockProducts } from '../data/mockProducts';

export class MockStoreService {
  private products: Product[] = mockProducts;

  public getAllProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public searchProducts(query: string, category?: string, color?: string, size?: string): Product[] {
    const q = query.toLowerCase().trim();
    return this.products.filter(p => {
      const matchText = (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
      const matchesQuery = !q || matchText.includes(q) || p.category.toLowerCase().includes(q);
      const matchesCategory = !category || p.category.toLowerCase() === category.toLowerCase();

      let matchesVariant = true;
      if (color || size) {
        matchesVariant = p.variants.some(v => {
          const colorMatch = !color || (v.color && v.color.toLowerCase() === color.toLowerCase());
          const sizeMatch = !size || (v.size && v.size.toString() === size.toString());
          return colorMatch && sizeMatch;
        });
      }

      return matchesQuery && matchesCategory && matchesVariant;
    });
  }
}

export const mockStoreService = new MockStoreService();
