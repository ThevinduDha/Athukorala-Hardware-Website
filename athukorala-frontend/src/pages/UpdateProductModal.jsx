import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Box, DollarSign, ListTree, Activity, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const UpdateProductModal = ({ isOpen, onClose, product, onUpdateSuccess }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  // Master Category List
  const categories = ["HARDWARE", "TOOLS", "PAINT", "ELECTRICAL", "PLUMBING", "CONSTRUCTION"];

  useEffect(() => {
    // 1. Fetch Suppliers for the dropdown
    fetch("http://localhost:8080/api/suppliers/all")
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => console.error("Supplier Registry Offline"));

    // 2. Pre-fill product data
    if (product) {
      setValue("name", product.name);
      setValue("category", product.category);
      setValue("price", product.price);
      setValue("stockQuantity", product.stockQuantity);
      setValue("description", product.description);
      setValue("supplierId", product.supplier?.id || ""); // Map current supplier ID
      setUploadedImageUrl(product.imageUrl);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Syncing modifications with registry...");
    
    // Construct the payload matching the backend structure
    const updatedData = { 
        ...data, 
        imageUrl: uploadedImageUrl,
        supplier: data.supplierId ? { id: parseInt(data.supplierId) } : null 
    };

    try {
      const response = await fetch(`http://localhost:8080/api/products/update/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("Asset Update Authorized", { id: loadingToast });
        onUpdateSuccess(); 
        onClose();
      } else {
        toast.error("Registry Refused Data: Protocol Violation", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Link Offline: Backend Unreachable", { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end bg-black/90 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-xl h-full bg-[#050505] border-l border-[#D4AF37]/30 p-12 relative shadow-[-50px_0_100px_rgba(0,0,0,0.9)] overflow-y-auto z-10 text-left"
      >
        <button onClick={onClose} className="absolute top-10 right-10 text-gray-600 hover:text-[#D4AF37] transition-all hover:rotate-90">
          <X size={28} />
        </button>

        <header className="mb-16 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={14} className="text-[#D4AF37] animate-pulse" />
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">Modification Protocol</p>
          </div>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Update <br /><span className="text-transparent stroke-text">Inventory</span>
          </h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 text-left">
          <div className="p-2 border border-white/5 bg-white/[0.02] shadow-inner">
             <ImageUpload onUploadSuccess={(url) => setUploadedImageUrl(url)} />
          </div>

          <div className="space-y-8">
            <InputGroup label="Product Identity" icon={<Box size={16}/>} register={register("name")} />
            
            {/* CATEGORY DROPDOWN PROTOCOL */}
            <div className="group text-left">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black block mb-4">Asset Classification</label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/30 group-focus-within:text-[#D4AF37] transition-all"><ListTree size={16}/></div>
                <select 
                  {...register("category")}
                  className="w-full bg-transparent border-b border-white/10 pl-10 py-4 focus:border-[#D4AF37] outline-none transition-all text-sm uppercase tracking-[0.2em] font-bold text-white appearance-none"
                >
                  <option value="" disabled className="bg-black">SELECT CATEGORY</option>
                  {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                </select>
              </div>
            </div>

            {/* SUPPLIER DROPDOWN PROTOCOL */}
            <div className="group text-left">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black block mb-4">Origin Partner (Supplier)</label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/30 group-focus-within:text-[#D4AF37] transition-all"><Truck size={16}/></div>
                <select 
                  {...register("supplierId")}
                  className="w-full bg-transparent border-b border-white/10 pl-10 py-4 focus:border-[#D4AF37] outline-none transition-all text-sm uppercase tracking-[0.2em] font-bold text-white appearance-none"
                >
                  <option value="" className="bg-black">UNASSIGNED / INTERNAL</option>
                  {suppliers.map(sup => <option key={sup.id} value={sup.id} className="bg-black">{sup.name.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <InputGroup label="Unit Valuation" icon={<DollarSign size={16}/>} register={register("price")} type="number" />
              <InputGroup label="Stock Volume" icon={<Box size={16}/>} register={register("stockQuantity")} type="number" />
            </div>

            <div className="group text-left">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black block mb-4">Technical Specifications</label>
              <textarea 
                {...register("description")}
                className="w-full bg-white/[0.03] border border-white/10 p-6 focus:border-[#D4AF37] focus:bg-white/[0.05] outline-none transition-all text-sm h-40 font-medium tracking-wide leading-relaxed text-gray-300"
                placeholder="Enter technical details..."
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-[#D4AF37] text-black font-black py-6 tracking-[0.5em] uppercase text-[11px] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.25)] group"
          >
            <Save size={18} className="group-hover:rotate-12 transition-transform" /> Commit Changes to Registry
          </motion.button>
        </form>
      </motion.div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </motion.div>
  );
};

const InputGroup = ({ label, icon, register, type = "text" }) => (
  <div className="group text-left">
    <label className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black block mb-4">{label}</label>
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/30 group-focus-within:text-[#D4AF37] transition-all duration-500">{icon}</div>
      <input 
        {...register} type={type}
        className="w-full bg-transparent border-b border-white/10 pl-10 py-4 focus:border-[#D4AF37] outline-none transition-all text-sm uppercase tracking-[0.2em] font-bold text-white placeholder:text-gray-800"
      />
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-focus-within:w-full transition-all duration-700 shadow-[0_0_15px_#D4AF37]" />
    </div>
  </div>
);

export default UpdateProductModal;