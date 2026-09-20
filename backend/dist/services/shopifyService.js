"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopifyService = exports.ShopifyService = void 0;
class ShopifyService {
    domain;
    token;
    apiVersion;
    constructor() {
        this.domain = process.env.SHOPIFY_STORE_DOMAIN || '';
        this.token = process.env.SHOPIFY_ACCESS_TOKEN || '';
        this.apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';
    }
    /**
     * Fetch products from Shopify GraphQL Admin API
     */
    async fetchProductsFromGraphQL(queryStr) {
        if (!this.domain || !this.token) {
            throw new Error('Shopify domain or access token missing in backend environment variables.');
        }
        const graphqlEndpoint = `https://${this.domain}/admin/api/${this.apiVersion}/graphql.json`;
        const graphqlQuery = {
            query: `
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
                featuredImage {
                  url
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price
                      compareAtPrice
                      sku
                      inventoryQuantity
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
            variables: {
                query: queryStr || null
            }
        };
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': this.token
            },
            body: JSON.stringify(graphqlQuery)
        });
        if (!response.ok) {
            throw new Error(`Shopify GraphQL API returned HTTP error ${response.status}: ${await response.text()}`);
        }
        const json = await response.json();
        if (json.errors) {
            throw new Error(`Shopify GraphQL Errors: ${JSON.stringify(json.errors)}`);
        }
        // Map GraphQL node response to clean internal Product structure
        const edges = json.data?.products?.edges || [];
        return edges.map((edge) => {
            const node = edge.node;
            const variants = (node.variants?.edges || []).map((vEdge) => {
                const vNode = vEdge.node;
                const sizeOpt = vNode.selectedOptions?.find((o) => o.name.toLowerCase() === 'size')?.value;
                const colorOpt = vNode.selectedOptions?.find((o) => o.name.toLowerCase() === 'color')?.value;
                const qty = vNode.inventoryQuantity ?? 10;
                return {
                    id: vNode.id,
                    title: vNode.title,
                    price: parseFloat(vNode.price || '0'),
                    compareAtPrice: vNode.compareAtPrice ? parseFloat(vNode.compareAtPrice) : undefined,
                    sku: vNode.sku || '',
                    inventoryQuantity: qty,
                    size: sizeOpt,
                    color: colorOpt,
                    available: qty > 0
                };
            });
            return {
                id: node.id,
                title: node.title,
                description: node.description || '',
                category: node.productType || 'Footwear',
                tags: node.tags || [],
                vendor: node.vendor || 'Shopify Store',
                image: node.featuredImage?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
                variants,
                createdAt: node.createdAt
            };
        });
    }
}
exports.ShopifyService = ShopifyService;
exports.shopifyService = new ShopifyService();
