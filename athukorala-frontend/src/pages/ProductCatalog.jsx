// no need this file 

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, CreditCard, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [cardData, setCardData] = useState({ number: '', cvv: '', expiry: '' });

  useEffect(() => {
    // Parallel Fetch for Products and Active Promotions [cite: 308, 422]
    Promise.all([
      fetch("http://localhost:8080/api/products/all").then(res => res.json()),
      fetch("http://localhost:8080/api/promotions/all").then(res => res.json())
    ]).then(([productData, promoData]) => {
      setProducts(Array.isArray(productData) ? productData : []);
      setPromotions(Array.isArray(promoData) ? promoData : []);
    });
  }, []);

  // HELPER: Calculate current price based on promotion logic [cite: 440]
  const getEffectivePrice = (product) => {
    const now = new Date();
    // Find active promo for this specific product or category [cite: 434, 437]
    const activePromo = promotions.find(p => 
      (p.targetId === product.id || p.targetCategory === product.category) &&
      p.active &&
      new Date(p.startDate) <= now &&
      new Date(p.endDate) >= now
    );

    if (!activePromo) return { price: product.price, isDiscounted: false };

    let discountedPrice = product.price;
    if (activePromo.type === 'PERCENTAGE') {
      discountedPrice = product.price * (1 - activePromo.value / 100); // [cite: 441]
    } else {
      discountedPrice = product.price - activePromo.value; // [cite: 442]
    }

    return { 
      price: Math.max(0, discountedPrice), // Prevent negative price 
      isDiscounted: true, 
      savings: product.price - discountedPrice,
      promoTitle: activePromo.title
    };
  };

  const addToCart = (product) => {
    const effective = getEffectivePrice(product);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, price: effective.price, qty: 1 }]; // Store the discounted price [cite: 427]
    });
    toast.success(`${product.name.toUpperCase()} ADDED TO REGISTRY`);
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="relative text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => {
          const effective = getEffectivePrice(product);
          return (
            <div key={product.id} className="p-6 border border-white/10 bg-white/[0.02] group hover:border-[#D4AF37]/50 transition-all relative">
              {effective.isDiscounted && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-1 uppercase tracking-widest flex items-center gap-1 z-10">
                  <Tag size={10} /> {effective.promoTitle}
                </div>
              )}
              
              <h4 className="text-sm font-black uppercase text-white mb-2">{product.name}</h4>
              
              <div className="mb-6">
                {effective.isDiscounted ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-black text-[#D4AF37]">LKR {effective.price.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 line-through font-bold">LKR {product.price.toLocaleString()}</span>
                  </div>
                ) : (
                  <p className="text-lg font-black text-white">LKR {product.price.toLocaleString()}</p>
                )}
              </div>

              <button 
                onClick={() => addToCart(product)}
                className="w-full py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {/* FLOATING CART AND SIDEBAR PANEL REMAINS SAME AS PREVIOUS VERSION */}
      {/* ... (Keep the sidebar and checkout logic from the previous code) */}
    </div>
  );
};

export default ProductCatalog;