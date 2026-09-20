import { Product, DiscountRule } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod_101',
    title: 'Velocity Pro Running Shoes',
    description: 'Lightweight breathable mesh running shoes engineered for high traction and daily distance running.',
    category: 'Footwear',
    tags: ['running shoes', 'black', 'shoes', 'sports', 'footwear', 'breathable'],
    vendor: 'UrbanKicks',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T00:00:00Z',
    variants: [
      { id: 'var_101_8b', title: 'Black / Size 8', price: 4999, compareAtPrice: 5999, sku: 'VEL-BLK-8', inventoryQuantity: 14, size: '8', color: 'Black', available: true },
      { id: 'var_101_9b', title: 'Black / Size 9', price: 4999, compareAtPrice: 5999, sku: 'VEL-BLK-9', inventoryQuantity: 8, size: '9', color: 'Black', available: true },
      { id: 'var_101_10b', title: 'Black / Size 10', price: 4999, compareAtPrice: 5999, sku: 'VEL-BLK-10', inventoryQuantity: 0, size: '10', color: 'Black', available: false },
      { id: 'var_101_9w', title: 'White / Size 9', price: 4999, compareAtPrice: 5999, sku: 'VEL-WHT-9', inventoryQuantity: 5, size: '9', color: 'White', available: true }
    ]
  },
  {
    id: 'prod_102',
    title: 'AeroGlide Ultra Cushion Sneaker',
    description: 'Ultra-plush foam midsole sneakers designed for all-day comfort and street style.',
    category: 'Footwear',
    tags: ['sneakers', 'white', 'black', 'casual', 'cushioned'],
    vendor: 'UrbanKicks',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-12T00:00:00Z',
    variants: [
      { id: 'var_102_8w', title: 'White / Size 8', price: 3499, compareAtPrice: 4200, sku: 'AERO-WHT-8', inventoryQuantity: 10, size: '8', color: 'White', available: true },
      { id: 'var_102_9w', title: 'White / Size 9', price: 3499, compareAtPrice: 4200, sku: 'AERO-WHT-9', inventoryQuantity: 12, size: '9', color: 'White', available: true },
      { id: 'var_102_9b', title: 'Black / Size 9', price: 3499, compareAtPrice: 4200, sku: 'AERO-BLK-9', inventoryQuantity: 15, size: '9', color: 'Black', available: true }
    ]
  },
  {
    id: 'prod_103',
    title: 'TrailTrek Waterproof Hiking Boots',
    description: 'Heavy duty waterproof leather boots built for rugged mountain trails and weather protection.',
    category: 'Footwear',
    tags: ['boots', 'hiking', 'brown', 'waterproof', 'outdoor'],
    vendor: 'UrbanKicks',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T00:00:00Z',
    variants: [
      { id: 'var_103_9br', title: 'Brown / Size 9', price: 7999, compareAtPrice: 9999, sku: 'TRL-BRN-9', inventoryQuantity: 4, size: '9', color: 'Brown', available: true },
      { id: 'var_103_10br', title: 'Brown / Size 10', price: 7999, compareAtPrice: 9999, sku: 'TRL-BRN-10', inventoryQuantity: 6, size: '10', color: 'Brown', available: true }
    ]
  },
  {
    id: 'prod_104',
    title: 'DryFit Athletic Training Tee',
    description: 'Moisture wicking quick-dry performance t-shirt built for gym workouts and athletic training.',
    category: 'Apparel',
    tags: ['t-shirt', 'black', 'dryfit', 'gym', 'apparel'],
    vendor: 'UrbanKicks',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-04-15T00:00:00Z',
    variants: [
      { id: 'var_104_m', title: 'Black / Medium', price: 1299, compareAtPrice: 1599, sku: 'TEE-BLK-M', inventoryQuantity: 25, size: 'M', color: 'Black', available: true },
      { id: 'var_104_l', title: 'Black / Large', price: 1299, compareAtPrice: 1599, sku: 'TEE-BLK-L', inventoryQuantity: 18, size: 'L', color: 'Black', available: true }
    ]
  }
];

export const mockDiscountRules: DiscountRule[] = [
  {
    id: 'disc_001',
    merchantId: 'merchant_001',
    code: 'FESTIVE20',
    type: 'percentage',
    value: 20, // 20% off
    minOrderValue: 2000,
    active: true
  },
  {
    id: 'disc_002',
    merchantId: 'merchant_001',
    code: 'FLAT500',
    type: 'fixed',
    value: 500, // ₹500 off
    minOrderValue: 3000,
    active: true
  },
  {
    id: 'disc_003',
    merchantId: 'merchant_001',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderValue: 1000,
    active: true
  }
];
