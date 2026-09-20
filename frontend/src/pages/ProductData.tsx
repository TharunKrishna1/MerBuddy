import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { Package, Search, Calculator, CheckCircle2 } from 'lucide-react';

export const ProductData: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [calcPrice, setCalcPrice] = useState('4999');
  const [couponCode, setCouponCode] = useState('FESTIVE20');
  const [calcResult, setCalcResult] = useState<any>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const list = await api.getProducts();
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.searchProducts(searchQuery);
      setProducts(res);
    } catch (err) {
      console.error('Search products failed:', err);
    }
  };

  const handleRunCalc = async () => {
    try {
      const res = await api.applyDiscount('merchant_001', couponCode, parseFloat(calcPrice));
      setCalcResult(res.data);
    } catch (err: any) {
      alert(err.message || 'Invalid calculation request');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-navy-light pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
            <Package className="text-accent" />
            <span>Product Catalog & Backend Pricing Pipeline</span>
          </h2>
          <p className="text-xs text-neutral-dark mt-1">
            Browse verified store products, variant inventory, and simulate backend price/discount computations.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products e.g. running shoes, black..."
              className="bg-navy border border-navy-light text-surface text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-accent w-64"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-accent text-dark font-bold text-xs rounded-xl">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-navy p-5 rounded-2xl border border-navy-light space-y-3 shadow-md">
                <div className="h-40 rounded-xl overflow-hidden bg-navy-dark">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-mono text-[10px] font-bold">
                    {p.category}
                  </span>
                  <span className="text-xs text-neutral-dark">{p.vendor}</span>
                </div>

                <h3 className="text-sm font-bold text-surface">{p.title}</h3>
                <p className="text-xs text-neutral line-clamp-2">{p.description}</p>

                {/* Variants List */}
                <div className="border-t border-navy-light pt-3 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-dark">Available Variants:</span>
                  {p.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-navy-dark border border-navy-light">
                      <span className="text-neutral font-medium">{v.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-accent">₹{v.price.toLocaleString('en-IN')}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${v.inventoryQuantity > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {v.inventoryQuantity > 0 ? `${v.inventoryQuantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Sandbox Simulator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
            <h3 className="text-sm font-bold text-surface flex items-center space-x-2">
              <Calculator size={16} className="text-accent" />
              <span>Backend Price Simulator</span>
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark mb-1 block">
                Original Item Price (INR)
              </label>
              <input
                type="number"
                value={calcPrice}
                onChange={(e) => setCalcPrice(e.target.value)}
                className="w-full bg-navy-dark border border-navy-light text-surface px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark mb-1 block">
                Coupon Code
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-navy-dark border border-navy-light text-surface px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-accent uppercase"
              />
            </div>

            <button
              onClick={handleRunCalc}
              className="w-full py-2.5 bg-accent text-dark font-bold text-xs rounded-xl hover:bg-accent-hover transition-all"
            >
              Run Pricing Engine Calculation
            </button>

            {calcResult && (
              <div className="p-4 bg-navy-dark rounded-xl border border-navy-light space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral">
                  <span>Original Price:</span>
                  <span className="line-through">{calcResult.formattedOriginalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Discount Applied ({calcResult.discountPercentage}%):</span>
                  <span>-₹{calcResult.discountAmount}</span>
                </div>
                <div className="flex items-center justify-between text-surface font-extrabold text-sm border-t border-navy-light pt-2">
                  <span>Final Payable Price:</span>
                  <span className="text-accent">{calcResult.formattedFinalPrice}</span>
                </div>
                <div className="text-[11px] text-neutral-dark pt-1 italic">
                  🔊 TTS Speech String: "{calcResult.speechFormattedPrice}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
