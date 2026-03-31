import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, RotateCcw, Save, Box, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffInventoryControl = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustments, setAdjustments] = useState({}); // Tracks local +/- changes before saving

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => toast.error("Asset Registry Offline"));
  };

  const handleAdjust = (productId, delta) => {
    setAdjustments(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + delta
    }));
  };

  // --- UPDATED COMMIT LOGIC: Includes Staff Identity for Audit Logs ---
  const commitChange = async (product) => {
    const change = adjustments[product.id];
    if (!change || change === 0) return;

    const newTotal = product.stockQuantity + change;
    if (newTotal < 0) {
      toast.error("PROTOCOL ERROR: NEGATIVE STOCK PROHIBITED");
      return;
    }

    // Retrieve staff identity from local session
    const userSession = JSON.parse(localStorage.getItem("user") || '{"name":"STAFF_OPERATOR"}');
    const staffName = userSession.name;

    const loading = toast.loading(`Synchronizing ${product.name}...`);

    try {
      // Updated URL to include staffName for the backend Audit Log
      const res = await fetch(`http://localhost:8080/api/products/${product.id}/adjust-stock?delta=${change}&staffName=${staffName}`, {
        method: 'PATCH'
      });

      if (res.ok) {
        toast.success("REGISTRY SYNCHRONIZED & LOGGED", { id: loading });
        // Reset only this product's local adjustment
        setAdjustments(prev => ({ ...prev, [product.id]: 0 }));
        fetchProducts(); // Refresh data to show new totals
      } else {
        const errorMsg = await res.text();
        toast.error(errorMsg || "SYNC REJECTED", { id: loading });
      }
    } catch (err) {
      toast.error("SYSTEM LINK FAILURE", { id: loading });
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* SEARCH COMMAND */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="QUERY ASSET NAME OR CATEGORY..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 py-5 pl-14 pr-8 text-[11px] font-black tracking-[0.2em] outline-none focus:border-[#D4AF37] transition-all uppercase"
        />
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {filtered.map((product) => (
            <motion.div 
              layout
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between group hover:border-[#D4AF37]/20 transition-all shadow-xl"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-black border border-white/5 p-2 shrink-0 overflow-hidden">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">{product.category}</p>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-white">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Current Registry:</span>
                    <span className={`text-[10px] font-mono font-black ${product.stockQuantity < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {product.stockQuantity} UNITS
                    </span>
                  </div>
                </div>
              </div>

              {/* ADJUSTMENT CONTROLS */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-black border border-white/10 p-1 rounded-sm shadow-inner">
                  <button 
                    onClick={() => handleAdjust(product.id, -1)}
                    className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all active:scale-90"
                  >
                    <Minus size={14} />
                  </button>
                  
                  <div className="w-12 text-center font-mono text-xs font-black text-[#D4AF37]">
                    {adjustments[product.id] > 0 ? `+${adjustments[product.id]}` : adjustments[product.id] || 0}
                  </div>

                  <button 
                    onClick={() => handleAdjust(product.id, 1)}
                    className="p-2 hover:bg-green-500/20 text-gray-500 hover:text-green-500 transition-all active:scale-90"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => commitChange(product)}
                  disabled={!adjustments[product.id]}
                  className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 ${
                    adjustments[product.id] 
                    ? 'bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)]' 
                    : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <Save size={12} /> Sync
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StaffInventoryControl;