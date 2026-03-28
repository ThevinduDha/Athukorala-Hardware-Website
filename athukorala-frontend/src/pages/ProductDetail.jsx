import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, 
  Tag, Truck, Sparkles, Database, Activity, Info, Award, Cpu, Boxes
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import SupplierContactCard from '../components/SupplierContactCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest"}');

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => toast.error("Hardware registry sync failed"));
  }, [id]);

  const handleInitializePurchase = async () => {
    if (user.name === "Guest") {
      toast.error("AUTHENTICATION REQUIRED");
      return;
    }
    const loadingToast = toast.loading("Syncing Registry...");
    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 }),
      });
      if (response.ok) {
        toast.success("Redirecting to Payment...", { id: loadingToast });
        setTimeout(() => navigate('/checkout'), 1000);
      }
    } catch (error) {
      toast.error("Backend Offline", { id: loadingToast });
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0, 1, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-[#D4AF37] tracking-[0.5em] uppercase text-[10px] font-black"
      >
        Decoding Asset Protocol...
      </motion.div>
    </div>
  );

  const hasDiscount = product?.discountedPrice && product.discountedPrice < product.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans text-left relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* ANIMATED BACKGROUND GRADIENT */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#D4AF37] blur-[200px] rounded-full -z-10 pointer-events-none" 
      />

      {/* BACK BUTTON WITH HOVER SLIDE */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-3 text-gray-500 hover:text-[#D4AF37] transition-all mb-16 uppercase text-[10px] font-black tracking-[0.4em] group"
      >
        <ArrowLeft size={16} className="group-hover:scale-125 transition-transform" /> 
        Return to Catalog Registry
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* LEFT COLUMN: VISUALS */}
        <div className="lg:col-span-6 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="aspect-square bg-white/[0.01] border border-white/5 p-16 relative overflow-hidden shadow-2xl backdrop-blur-sm group"
          >
            {/* FLOATING SCAN LINE EFFECT */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[1px] bg-[#D4AF37]/20 z-10 pointer-events-none"
            />

            <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Live Asset Feed</p>
            </div>

            {hasDiscount && (
              <motion.div 
                initial={{ x: 100 }} animate={{ x: 0 }}
                className="absolute top-0 right-0 bg-[#D4AF37] text-black px-6 py-3 font-black uppercase tracking-widest text-[10px] z-10 flex items-center gap-2"
              >
                <Sparkles size={14} /> Promotion Active
              </motion.div>
            )}

            <motion.img 
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-left">
              <Truck size={14} className="text-[#D4AF37]" />
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-500">Logistics Source</h3>
            </div>
            <div className="bg-[#080808] border border-white/5 p-8 shadow-xl hover:border-[#D4AF37]/40 transition-all duration-500">
              <SupplierContactCard supplier={product.supplier} />
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: DATA */}
        <div className="lg:col-span-6 flex flex-col space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="bg-[#D4AF37] text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest"
              >
                Verified Asset
              </motion.span>
              <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase italic">{product.category}</p>
            </div>
            
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.85] text-left">
              {product.name.split(' ').map((word, i) => (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 * i }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            
            <motion.div 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="p-10 border-y border-white/5 bg-white/[0.01] relative overflow-hidden transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Industrial Valuation Protocol</p>
              <div className="flex items-baseline gap-8">
                <span className="text-6xl font-mono font-black text-white tracking-tighter">
                  LKR {hasDiscount ? product.discountedPrice.toLocaleString() : product.price?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                    className="text-2xl font-mono text-gray-400 line-through decoration-[#D4AF37] decoration-2 italic"
                  >
                    LKR {product.price?.toLocaleString()}
                  </motion.span>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* SPECS GRID WITH STAGGERED REVEAL */}
          <div className="grid grid-cols-2 gap-8">
            <SpecItem icon={<Info />} label="Registry Description" content={product.description || "Unregistered"} delay={0.3} />
            <SpecItem icon={<Activity />} label="Registry Status" content={`${product.stockQuantity || 0} Units`} color={product.stockQuantity > 0 ? "text-green-500" : "text-red-500"} delay={0.4} />
            <SpecItem icon={<Award />} label="Authenticity" content="Athukorala Certified" delay={0.5} />
            <SpecItem icon={<Cpu />} label="Tech Framework" content="Standard Industrial V3" delay={0.6} />
          </div>

          {/* CTA BUTTONS WITH PULSE ACTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.7 }}
            className="pt-12 flex gap-5"
          >
            <motion.button 
              onClick={handleInitializePurchase}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-[#D4AF37] text-black py-7 font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] group"
            >
              <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" /> Initialize Purchase
            </motion.button>
            <motion.button 
              whileHover={{ borderColor: "#D4AF37", color: "#D4AF37" }}
              className="px-12 border border-white/10 text-gray-500 transition-all bg-white/[0.02]"
            >
              <Tag size={24} />
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const SpecItem = ({ icon, label, content, color = "text-white", delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="text-left border-l border-white/5 pl-6 py-2 group hover:border-[#D4AF37] transition-colors"
  >
    <div className="flex items-center gap-2 text-gray-600 mb-2 group-hover:text-[#D4AF37] transition-colors">
      {React.cloneElement(icon, { size: 16 })} 
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-xs font-black uppercase tracking-widest ${color} line-clamp-2`}>{content}</p>
  </motion.div>
);

export default ProductDetail;