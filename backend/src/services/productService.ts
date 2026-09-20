import { Product } from '../types';
import { mockStoreService } from './mockStoreService';
import { shopifyService } from './shopifyService';

export class ProductService {
  private isMockMode(): boolean {
    return process.env.MOCK_STORE !== 'false';
  }

  public async getProducts(): Promise<Product[]> {
    if (this.isMockMode()) {
      return mockStoreService.getAllProducts();
    }
    try {
      return await shopifyService.fetchProductsFromGraphQL();
    } catch (err) {
      console.warn('Shopify GraphQL fetch failed, falling back to mock store:', err);
      return mockStoreService.getAllProducts();
    }
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  public async searchProducts(query: string, category?: string, color?: string, size?: string): Promise<Product[]> {
    if (this.isMockMode()) {
      return mockStoreService.searchProducts(query, category, color, size);
    }
    try {
      const shopifyProds = await shopifyService.fetchProductsFromGraphQL(query);
      if (shopifyProds.length > 0) return shopifyProds;
      return mockStoreService.searchProducts(query, category, color, size);
    } catch (err) {
      return mockStoreService.searchProducts(query, category, color, size);
    }
  }
}

export const productService = new ProductService();
