import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingCart, Eye, Box, Zap, Droplets, Hammer } from 'lucide-react';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error("Catalog Offline"));
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== "ALL") {
      result = result.filter(p => p.category.toUpperCase() === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [category, searchTerm, products]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 font-sans">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Athukorala Traders</p>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            Premium <br /> <span className="text-transparent stroke-text">Hardware</span>
          </h1>
        </motion.div>

        <div className="flex flex-col gap-6 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ASSETS..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 py-4 pl-12 pr-8 text-[10px] tracking-widest outline-none focus:border-[#D4AF37]/50 w-full md:w-80 uppercase font-bold transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["ALL", "ELECTRICAL", "PLUMBING", "TOOLS", "PAINTS"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${category === cat ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* PRODUCT GRID */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -10 }}
    className="group relative bg-white/[0.02] border border-white/5 p-6 transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30"
  >
    {/* Product Image */}
    <div className="aspect-square bg-black border border-white/5 mb-6 overflow-hidden relative">
      <img 
        src={product.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} 
        alt={product.name} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
      />
      {product.stockQuantity <= 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[10px] font-black tracking-[0.4em] text-red-500 border border-red-500/50 px-4 py-2">OUT OF STOCK</span>
        </div>
      )}
    </div>

    {/* Details */}
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <p className="text-[#D4AF37] text-[9px] font-black tracking-widest uppercase">{product.category}</p>
        <p className="text-gray-500 font-mono text-[10px]">LKR {product.price}</p>
      </div>
      <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
    </div>

    {/* Hover Actions */}
    <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
      <button className="flex-1 bg-[#D4AF37] text-black py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#E5C158]">
        <ShoppingCart size={14} /> Add to Cart
      </button>
      <button className="p-3 border border-white/10 hover:border-[#D4AF37] transition-colors">
        <Eye size={16} />
      </button>
    </div>
  </motion.div>
);

export default CustomerDashboard;