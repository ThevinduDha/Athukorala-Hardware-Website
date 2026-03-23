import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ShieldCheck, Box, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => toast.error("System Failure: Asset data unreachable"));
  }, [id]);

  if (!product) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37] tracking-[0.5em] uppercase text-xs">Loading Asset Data...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-colors mb-12 uppercase text-[10px] font-bold tracking-widest"
      >
        <ArrowLeft size={16} /> Return to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT: VISUAL ASSET */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square bg-white/[0.02] border border-white/10 p-10 relative group">
            <img 
              src={product.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-lighten grayscale group-hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </motion.div>

        {/* RIGHT: SPECIFICATIONS */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">{product.category}</p>
              <div className="h-[1px] w-12 bg-white/10" />
              <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] uppercase">{product.brand || "Industrial Grade"}</p>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
               <span className="text-4xl font-mono text-[#D4AF37]">LKR {product.price}</span>
               {/* Placeholder for Discount Logic (Section 4) */}
               <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 text-[9px] font-black tracking-widest uppercase border border-[#D4AF37]/20">Verified Pricing</span>
            </div>
          </header>

          <div className="space-y-8 mb-12">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Specifications & Details</p>
              <p className="text-gray-400 leading-relaxed text-sm max-w-lg">{product.description || "No technical specifications provided for this asset."}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-white/[0.02] border border-white/5">
                <p className="text-gray-600 text-[9px] font-bold uppercase mb-1">Availability</p>
                <p className={`text-xs font-black uppercase ${product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} Units In Stock` : 'Depleted'}
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5">
                <p className="text-gray-600 text-[9px] font-bold uppercase mb-1">Authenticity</p>
                <p className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <ShieldCheck size={12} className="text-[#D4AF37]" /> Athukorala Certified
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            <button className="flex-1 bg-[#D4AF37] text-black py-5 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all">
              <ShoppingCart size={18} /> Initialize Purchase
            </button>
            <button className="px-8 border border-white/10 hover:border-[#D4AF37] transition-colors">
               <Tag size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;