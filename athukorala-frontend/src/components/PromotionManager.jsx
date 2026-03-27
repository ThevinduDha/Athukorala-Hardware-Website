import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Percent, ShieldCheck, Box, Layers, Calendar, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PromotionManager = ({ onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [categories] = useState(["Electrical", "Plumbing", "Tools", "Paints", "Construction"]); 
  
  // Logic: Get today's date in YYYY-MM-DD format for min-date validation
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    type: 'PERCENTAGE',
    value: '',
    targetType: 'PRODUCT',
    targetId: '',
    targetCategory: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data || []));
  }, []);

  const handleCreatePromotion = async (e) => {
    e.preventDefault();

    // --- VALIDATION PROTOCOLS ---
    if (formData.type === 'PERCENTAGE' && parseFloat(formData.value) > 100) {
      return toast.error("VALIDATION ERROR: REDUCTION CANNOT EXCEED 100%");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return toast.error("DATE ERROR: TERMINATION MUST BE AFTER ACTIVATION");
    }

    const loading = toast.loading("Deploying Discount Protocol...");
    
    try {
      const res = await fetch("http://localhost:8080/api/promotions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Promotion Authorized Successfully", { id: loading });
        
        // Reset Form Protocol
        setFormData({
          title: '', type: 'PERCENTAGE', value: '',
          targetType: 'PRODUCT', targetId: '', targetCategory: '',
          startDate: '', endDate: ''
        });
        e.target.reset();

        if (onSuccess) onSuccess(); 
      } else {
        toast.error("Protocol Refused: Logic Error", { id: loading });
      }
    } catch (err) {
      toast.error("System Link Offline", { id: loading });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-10 bg-[#080808] border border-white/5 backdrop-blur-3xl relative text-left shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37]/10 rounded-full">
            <Percent className="text-[#D4AF37]" size={18} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Management CRUD</h3>
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
          Create <span className="text-transparent stroke-text">Discount Protocol</span>
        </h2>
      </header>

      <form onSubmit={handleCreatePromotion} className="space-y-10">
        <div className="grid grid-cols-2 gap-6">
          <TargetButton 
            active={formData.targetType === 'PRODUCT'} 
            onClick={() => setFormData({...formData, targetType: 'PRODUCT'})}
            icon={<Box size={14} />} label="Specific Product"
          />
          <TargetButton 
            active={formData.targetType === 'CATEGORY'} 
            onClick={() => setFormData({...formData, targetType: 'CATEGORY'})}
            icon={<Layers size={14} />} label="Full Category"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">Deployment Target</label>
          <div className="relative group">
            <select 
              required value={formData.targetType === 'PRODUCT' ? formData.targetId : formData.targetCategory}
              className="w-full bg-black border border-white/10 p-5 focus:border-[#D4AF37] outline-none text-xs font-bold appearance-none text-white transition-all"
              onChange={(e) => setFormData(formData.targetType === 'PRODUCT' ? {...formData, targetId: e.target.value} : {...formData, targetCategory: e.target.value})}
            >
              <option value="">-- SELECT FROM REGISTRY --</option>
              {formData.targetType === 'PRODUCT' 
                ? products.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()} (LKR {p.price})</option>)
                : categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)
              }
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-[#D4AF37]">
              <Zap size={14} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">Protocol Title</label>
              <input 
                type="text" required value={formData.title} placeholder="E.G. SEASONAL CLEARANCE" 
                className="w-full bg-transparent border-b border-white/10 py-4 text-xs uppercase font-bold focus:border-[#D4AF37] outline-none transition-all" 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">Price Model</label>
                <select className="w-full bg-transparent border-b border-white/10 py-4 text-xs font-bold outline-none focus:border-[#D4AF37]" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="PERCENTAGE">% REDUCTION</option>
                  <option value="FIXED_AMOUNT">FIXED LKR</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">Valuation</label>
                <input 
                  type="number" required value={formData.value} placeholder="00" 
                  className="w-full bg-transparent border-b border-white/10 py-4 text-xs font-mono focus:border-[#D4AF37] outline-none" 
                  onChange={(e) => setFormData({...formData, value: e.target.value})} 
                />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2"><Calendar size={12}/> Activate On</label>
              <input 
                type="date" required 
                min={today} // Prevents past dates
                value={formData.startDate} 
                className="calendar-input w-full bg-white/5 border border-white/5 p-5 text-xs text-white outline-none focus:border-[#D4AF37]/50" 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
              />
           </div>
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2"><Calendar size={12}/> Terminate On</label>
              <input 
                type="date" required 
                min={formData.startDate || today} // Prevents termination before activation
                value={formData.endDate} 
                className="calendar-input w-full bg-white/5 border border-white/5 p-5 text-xs text-white outline-none focus:border-[#D4AF37]/50" 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
              />
           </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full py-6 bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
        >
          <ShieldCheck size={18} /> Authorize Promotion Protocol
        </motion.button>
      </form>

      {/* FIXED: CSS to make calendar icons visible in Dark Mode */}
      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }
        .calendar-input::-webkit-calendar-picker-indicator {
          filter: invert(70%) sepia(50%) saturate(1000%) hue-rotate(10deg) brightness(100%) contrast(100%);
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

const TargetButton = ({ active, onClick, icon, label }) => (
  <button 
    type="button" onClick={onClick}
    className={`py-5 border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${active ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg' : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'}`}
  >
    {icon} {label}
  </button>
);

export default PromotionManager;