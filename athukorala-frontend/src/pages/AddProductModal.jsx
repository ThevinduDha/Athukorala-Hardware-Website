import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Box, DollarSign, ListTree, Truck, AlertCircle, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const AddProductModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  const HARDWARE_CATEGORIES = [
    "ELECTRICAL",
    "PLUMBING",
    "PAINTING & ADHESIVES",
    "POWER TOOLS",
    "HAND TOOLS",
    "BUILDING MATERIALS",
    "FASTENERS & SCREWS",
    "SAFETY GEAR"
  ];

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8080/api/suppliers/all")
        .then((res) => res.json())
        .then((data) => setSuppliers(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Could not load suppliers", err));
    }
  }, [isOpen]);

  const getDefaultIcon = (category) => {
    if (!category) return "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png";
    const cat = category.toLowerCase();
    if (cat.includes('paint')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/paint-icon.png";
    if (cat.includes('tool')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/hammer-icon.png";
    if (cat.includes('elect')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/bolt-icon.png";
    return "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png";
  };

  const onInvalid = (errors) => {
    const firstError = Object.values(errors)[0]?.message || "CHECK MANDATORY FIELDS";

    toast.error(`PROTOCOL REJECTED: ${firstError.toUpperCase()}`, {
      icon: <AlertCircle size={20} className="text-red-500" />,
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#ff4444',
        border: '1px solid #ff4444',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '0.1em'
      }
    });
  };

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity),
      reorderLevel: 5,
      imageUrl: uploadedImageUrl || getDefaultIcon(data.category),
      supplier: data.supplierId ? { id: parseInt(data.supplierId) } : null
    };

    if (finalData.price <= 0 || finalData.stockQuantity < 0) {
      toast.error("VALUATION ERROR: INVALID NUMERIC DATA", {
        style: {
          borderRadius: '0px',
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontSize: '10px',
          fontWeight: 'bold'
        }
      });
      return;
    }

    const loadingToast = toast.loading("AUTHORIZING NEW ASSET...", {
      style: {
        borderRadius: '0px',
        background: '#050505',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
        fontSize: '10px',
        fontWeight: 'bold'
      }
    });

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        toast.success("INVENTORY REGISTRY UPDATED", {
          id: loadingToast,
          style: {
            borderRadius: '0px',
            background: '#D4AF37',
            color: '#000',
            fontSize: '10px',
            fontWeight: '900'
          }
        });
        reset();
        setUploadedImageUrl("");
        onClose();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("SERVER REJECTED DATA FORMAT", { id: loadingToast });
      }
    } catch (error) {
      toast.error("SYSTEM LINK OFFLINE", { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-[#080808] border-l border-[#D4AF37]/20 p-12 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto cursor-default"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-10">
          <X size={24} />
        </button>

        <header className="mb-12 text-left">
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">New Entry</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Inventory Item</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <div className="group text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">
              Product Visual
            </label>
            <ImageUpload onUploadSuccess={(url) => setUploadedImageUrl(url)} />
          </div>

          <InputGroup
            label="Product Name"
            icon={<Box size={16} />}
            register={register("name", { required: "Asset Name is required" })}
            placeholder="e.g. Nippon Paint Gold"
            error={errors.name}
          />

          <div className="group text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3 text-left">
              Primary Supplier (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">
                <Truck size={16} />
              </div>
              <select
                {...register("supplierId")}
                className="w-full bg-transparent border-b border-white/10 focus:border-[#D4AF37] pl-8 py-3 outline-none text-sm uppercase tracking-widest transition-all appearance-none text-white"
              >
                <option value="" className="bg-[#080808]">Select Supplier...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#080808]">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="group text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3 text-left">
              Category
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">
                <ListTree size={16} />
              </div>
              <select
                {...register("category", { required: "Category assignment required" })}
                className={`w-full bg-transparent border-b pl-8 py-3 outline-none text-sm uppercase tracking-widest transition-all appearance-none text-white cursor-pointer ${
                  errors.category ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
                }`}
              >
                <option value="" className="bg-[#080808]">SELECT CATEGORY...</option>
                {HARDWARE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#080808]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-[9px] text-red-500 font-black mt-2 uppercase tracking-widest flex items-center gap-1">
                <Info size={10} /> {errors.category.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 text-left">
            <InputGroup
              label="Unit Price"
              icon={<DollarSign size={16} />}
              register={register("price", {
                required: "Price required",
                min: { value: 0.01, message: "Value > 0" }
              })}
              placeholder="0.00"
              type="number"
              error={errors.price}
            />
            <InputGroup
              label="Quantity"
              icon={<Box size={16} />}
              register={register("stockQuantity", {
                required: "Qty required",
                min: { value: 0, message: "Min 0" }
              })}
              placeholder="0"
              type="number"
              error={errors.stockQuantity}
            />
          </div>

          <div className="group text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">
              Specifications
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-white/5 border border-white/10 p-4 focus:border-[#D4AF37] outline-none transition-all text-sm h-32 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-black py-5 tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all mt-10 shadow-2xl"
          >
            <Save size={20} /> Record Asset
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const InputGroup = ({ label, icon, register, placeholder, type = "text", error }) => (
  <div className="group text-left">
    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">
      {label}
    </label>
    <div className="relative text-left">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">
        {icon}
      </div>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        step="any"
        className={`w-full bg-transparent border-b pl-8 py-3 outline-none transition-all text-sm uppercase tracking-widest text-white placeholder:text-gray-800 ${
          error ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
        }`}
      />
    </div>
    {error && (
      <p className="text-[9px] text-red-500 font-black mt-2 uppercase tracking-widest flex items-center gap-1">
        <Info size={10} /> {error.message}
      </p>
    )}
  </div>
);

export default AddProductModal;