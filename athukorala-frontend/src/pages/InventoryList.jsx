import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Box, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpdateProductModal from './UpdateProductModal'; 
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // MODAL STATES
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Fetch all products on load
  const fetchProducts = () => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching stock"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. High-Security Delete Protocol (UPDATED FOR INTEGRITY HANDLING)
  const executeDelete = async () => {
    if (!selectedProduct) return;

    const loadingToast = toast.loading("Executing Delete Protocol...");
    
    try {
      const response = await fetch(`http://localhost:8080/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      const result = await response.json(); // Parse the structured response from backend

      if (response.ok) {
        toast.success(result.message || "Asset Successfully Purged", { id: loadingToast });
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
      } else {
        // If status is 403 (FORBIDDEN), it will show the Integrity Error message
        toast.error(result.message || "Authorization Denied or System Error", { 
          id: loadingToast,
          duration: 4000 
        });
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      toast.error("Connection Failed: Ensure Backend is Online", { id: loadingToast });
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-left">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Registry</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Current Stock</h2>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH INVENTORY..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 py-3 pl-10 pr-6 text-[10px] tracking-widest outline-none focus:border-[#D4AF37]/50 w-80 uppercase font-bold transition-all placeholder:text-gray-700"
          />
        </div>
      </div>

      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] tracking-[0.3em] uppercase text-gray-500 font-black">
              <th className="p-6">Asset Visual</th>
              <th className="p-6">Product Identity</th>
              <th className="p-6">Category</th>
              <th className="p-6">Pricing Protocol</th>
              <th className="p-6">Availability</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
              const discountPercent = hasDiscount 
                ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
                : 0;

              return (
                <motion.tr 
                  key={product.id} 
                  whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.02)" }}
                  className="border-b border-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <div className="w-14 h-14 bg-black border border-white/10 overflow-hidden relative group-hover:border-[#D4AF37]/50 transition-colors shadow-inner">
                      <img 
                        src={product.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-1" 
                      />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</span>
                      <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Ref: #{product.id.toString().padStart(4, '0')}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6">
                    {hasDiscount ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-gray-600 line-through text-[11px] font-mono">LKR {product.price.toLocaleString()}</span>
                           <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">-{discountPercent}%</span>
                        </div>
                        <span className="text-[#D4AF37] font-mono font-black text-base tracking-tighter">LKR {product.discountedPrice.toLocaleString()}</span>
                      </div>
                    ) : ( 
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Standard Value</span>
                        <span className="font-mono text-white text-base tracking-tighter">LKR {product.price?.toLocaleString()}</span> 
                      </div>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                       <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest w-fit ${product.stockQuantity > 5 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                         {product.stockQuantity} UNITS
                       </span>
                       <div className="w-20 h-1 bg-white/5 overflow-hidden rounded-full">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.min((product.stockQuantity / 50) * 100, 100)}%` }} 
                            className={`h-full ${product.stockQuantity > 5 ? 'bg-green-500' : 'bg-red-500'}`} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsUpdateModalOpen(true);
                        }}
                        className="p-2 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                        title="Update Entry"
                      >
                        <Edit size={14}/>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 transition-all"
                        title="Purge Asset"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex gap-8">
        <div className="p-5 bg-white/[0.02] border border-white/5 flex items-center gap-4 min-w-[200px]">
           <Box size={20} className="text-gray-500" />
           <div>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total Assets</p>
              <p className="text-lg font-black">{products.length} Entries</p>
           </div>
        </div>
        <div className="p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex items-center gap-4 min-w-[200px]">
           <TrendingDown size={20} className="text-[#D4AF37]" />
           <div>
              <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">Promo Active</p>
              <p className="text-lg font-black">{products.filter(p => p.discountedPrice < p.price).length} Items</p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateProductModal 
            isOpen={isUpdateModalOpen} 
            onClose={() => setIsUpdateModalOpen(false)} 
            product={selectedProduct}
            onUpdateSuccess={fetchProducts}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            onConfirm={executeDelete} 
            itemName={selectedProduct?.name} 
          />
        )}
      </AnimatePresence>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </motion.div>
  );
};

export default InventoryList;