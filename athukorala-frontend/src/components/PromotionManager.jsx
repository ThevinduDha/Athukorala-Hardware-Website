import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  ShieldCheck,
  Box,
  Layers,
  Calendar,
  Zap,
  RefreshCcw,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.07 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: 'easeOut' }
  }
};

const PromotionManager = ({ onSuccess, preSelected, editingItem, onCancelEdit }) => {
  const [products, setProducts] = useState([]);
  const [categories] = useState(["Electrical", "Plumbing", "Tools", "Paints", "Construction"]);
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
    if (preSelected) {
      setFormData(prev => ({
        ...prev,
        targetType: 'PRODUCT',
        targetId: preSelected.id.toString(),
        title: `${preSelected.name.toUpperCase()} PROMO`
      }));
    }
  }, [preSelected]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        type: editingItem.type,
        value: editingItem.value,
        targetType: editingItem.targetType,
        targetId: editingItem.targetId ? editingItem.targetId.toString() : '',
        targetCategory: editingItem.targetCategory || '',
        startDate: editingItem.startDate,
        endDate: editingItem.endDate
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingItem]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data || []));
  }, []);

  const handleProcessProtocol = async (e) => {
    e.preventDefault();

    if (formData.type === 'PERCENTAGE' && parseFloat(formData.value) > 100) {
      return toast.error("VALIDATION ERROR: REDUCTION CANNOT EXCEED 100%");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return toast.error("DATE ERROR: TERMINATION MUST BE AFTER ACTIVATION");
    }

    const payload = {
      ...formData,
      targetId: formData.targetId ? parseInt(formData.targetId) : null,
      value: parseFloat(formData.value),
      enabled: true
    };

    const isUpdate = !!editingItem;
    const url = isUpdate
      ? `http://localhost:8080/api/promotions/update/${editingItem.id}`
      : "http://localhost:8080/api/promotions/create";

    const method = isUpdate ? "PUT" : "POST";
    const loading = toast.loading(
      isUpdate ? "Updating Protocol..." : "Deploying Discount Protocol..."
    );

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          isUpdate
            ? "Protocol Modifications Committed"
            : "Promotion Authorized Successfully",
          { id: loading }
        );

        setFormData({
          title: '',
          type: 'PERCENTAGE',
          value: '',
          targetType: 'PRODUCT',
          targetId: '',
          targetCategory: '',
          startDate: '',
          endDate: ''
        });

        if (onSuccess) onSuccess();
      } else {
        const errorText = await res.text();
        console.error("Registry Rejection Details:", errorText);
        toast.error("Protocol Refused: Data Mismatch", { id: loading });
      }
    } catch (err) {
      toast.error("System Link Offline: Gateway Timeout", { id: loading });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* MAIN FORM PANEL ONLY */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl p-6 lg:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
      >
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${editingItem ? 'via-blue-500' : 'via-[#D4AF37]/50'} to-transparent`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8 flex flex-col lg:flex-row justify-between items-start gap-5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    editingItem
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      : 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                  }`}
                >
                  {editingItem ? (
                    <RefreshCcw size={18} className="animate-spin-slow" />
                  ) : (
                    <Percent size={18} />
                  )}
                </div>

                <h3
                  className={`text-[10px] font-black uppercase tracking-[0.5em] ${
                    editingItem ? 'text-blue-400' : 'text-[#D4AF37]'
                  }`}
                >
                  {editingItem ? 'Modification Mode' : 'Management CRUD'}
                </h3>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-white">
                {editingItem ? 'Update' : 'Create'}{' '}
                <span className="text-transparent stroke-text">
                  Discount Protocol
                </span>
              </h2>
            </div>

            {editingItem && (
              <button
                onClick={onCancelEdit}
                type="button"
                className="p-3 text-gray-500 hover:text-white border border-white/10 rounded-2xl group transition-all bg-white/[0.03] hover:bg-white/[0.06]"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>

          <form onSubmit={handleProcessProtocol} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TargetButton
                active={formData.targetType === 'PRODUCT'}
                onClick={() => setFormData({ ...formData, targetType: 'PRODUCT' })}
                icon={<Box size={14} />}
                label="Specific Product"
              />
              <TargetButton
                active={formData.targetType === 'CATEGORY'}
                onClick={() => setFormData({ ...formData, targetType: 'CATEGORY' })}
                icon={<Layers size={14} />}
                label="Full Category"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                Deployment Target
              </label>

              <div className="relative group">
                <select
                  required
                  value={
                    formData.targetType === 'PRODUCT'
                      ? formData.targetId
                      : formData.targetCategory
                  }
                  className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 focus:border-[#D4AF37] outline-none text-sm font-semibold appearance-none text-white transition-all"
                  onChange={(e) =>
                    setFormData(
                      formData.targetType === 'PRODUCT'
                        ? { ...formData, targetId: e.target.value }
                        : { ...formData, targetCategory: e.target.value }
                    )
                  }
                >
                  <option value="">-- SELECT FROM REGISTRY --</option>
                  {formData.targetType === 'PRODUCT'
                    ? products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name.toUpperCase()} (LKR {p.price})
                        </option>
                      ))
                    : categories.map((c) => (
                        <option key={c} value={c}>
                          {c.toUpperCase()}
                        </option>
                      ))}
                </select>

                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-[#D4AF37]">
                  <Zap size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                  Protocol Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="E.G. SEASONAL CLEARANCE"
                  className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm uppercase font-bold text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                    Price Model
                  </label>
                  <select
                    value={formData.type}
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm font-bold text-white outline-none focus:border-[#D4AF37] transition-all"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="PERCENTAGE">% REDUCTION</option>
                    <option value="FIXED_AMOUNT">FIXED LKR</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                    Valuation
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    placeholder="00"
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm font-mono text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-600"
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2">
                  <Calendar size={12} />
                  Activate On
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.startDate}
                  className="calendar-input w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm text-white outline-none focus:border-[#D4AF37]"
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2">
                  <Calendar size={12} />
                  Terminate On
                </label>
                <input
                  type="date"
                  required
                  min={formData.startDate || today}
                  value={formData.endDate}
                  className="calendar-input w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm text-white outline-none focus:border-[#D4AF37]"
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full rounded-2xl py-5 font-black text-[11px] uppercase tracking-[0.42em] flex items-center justify-center gap-4 transition-all shadow-2xl ${
                editingItem
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-[#D4AF37] hover:bg-white text-black'
              }`}
            >
              {editingItem ? (
                <RefreshCcw size={18} className="animate-spin-slow" />
              ) : (
                <ShieldCheck size={18} />
              )}
              {editingItem ? 'COMMIT MODIFICATIONS' : 'AUTHORIZE PROMOTION PROTOCOL'}
            </motion.button>
          </form>
        </div>
      </motion.div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4);
          color: transparent;
        }
        .calendar-input::-webkit-calendar-picker-indicator {
          filter: invert(70%) sepia(50%) saturate(1000%) hue-rotate(10deg) brightness(100%) contrast(100%);
          cursor: pointer;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

const TargetButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border flex items-center justify-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
      active
        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
        : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-white hover:bg-white/[0.06]'
    }`}
  >
    {icon} {label}
  </button>
);

export default PromotionManager;