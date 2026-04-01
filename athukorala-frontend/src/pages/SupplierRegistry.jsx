import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SupplierContactCard from '../components/SupplierContactCard';

const SupplierRegistry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Get current user role
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const isAdmin = user.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phoneNumber: '', category: 'GENERAL'
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/suppliers/all");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      toast.error("SUPPLIER DATABASE OFFLINE");
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const validate = () => {
    const phoneRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (formData.name.length < 3) return "COMPANY NAME TOO SHORT";
    if (!emailRegex.test(formData.email)) return "INVALID EMAIL PROTOCOL";
    if (!phoneRegex.test(formData.phoneNumber)) return "INVALID SRI LANKAN PHONE NUMBER";
    return null;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    const loading = toast.loading(editingId ? "Updating Registry..." : "Registering Vendor...");
    const url = editingId 
        ? `http://localhost:8080/api/suppliers/${editingId}` 
        : "http://localhost:8080/api/suppliers/add";

    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(editingId ? "Registry Updated" : "Vendor Registered", { id: loading });
        closeForm();
        fetchSuppliers();
      }
    } catch (err) {
      toast.error("Action Failed", { id: loading });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`PURGE PROTOCOL: Permanently remove ${name}?`)) return;
    const loading = toast.loading("Purging Vendor...");
    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Vendor Purged", { id: loading });
        fetchSuppliers();
      }
    } catch (err) { toast.error("Purge Failed", { id: loading }); }
  };

  const openEdit = (supplier) => {
    setFormData(supplier);
    setEditingId(supplier.id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowAdd(false);
    setEditingId(null);
    setFormData({ name: '', contactPerson: '', email: '', phoneNumber: '', category: 'GENERAL' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 text-left relative font-sans">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <ShieldAlert size={14} className="text-[#D4AF37]" />
             <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">Authorized Personnel Only</p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">Supplier <span className="text-transparent stroke-text">Registry</span></h1>
        </div>
        
        {isAdmin && (
            <button onClick={() => setShowAdd(!showAdd)} className="bg-[#D4AF37] text-black px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center gap-3 shadow-2xl">
              {showAdd ? <X size={16}/> : <Plus size={16} />} {showAdd ? "Close Protocol" : "Register New Vendor"}
            </button>
        )}
      </header>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <form onSubmit={handleAction} className="mb-20 p-10 bg-white/[0.02] border border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
              <InputBox label="Company Name" value={formData.name} onChange={v => setFormData({...formData, name: v.toUpperCase()})} />
              <InputBox label="Contact Person" value={formData.contactPerson} onChange={v => setFormData({...formData, contactPerson: v})} />
              <InputBox label="Email Address" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
              <InputBox label="Phone Number" value={formData.phoneNumber} onChange={v => setFormData({...formData, phoneNumber: v})} />
              
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Category</label>
                <select className="bg-black border border-white/10 p-5 text-xs font-bold tracking-widest outline-none focus:border-[#D4AF37] transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="GENERAL">GENERAL</option>
                  <option value="PAINTS">PAINTS</option>
                  <option value="TOOLS">TOOLS</option>
                  <option value="ELECTRICAL">ELECTRICAL</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button type="submit" className="w-full bg-white text-black font-black py-5 text-[10px] tracking-[0.4em] uppercase hover:bg-[#D4AF37] transition-all shadow-lg">
                  {editingId ? "Confirm Modifications" : "Authorize Registration"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {suppliers.map((s) => (
          <SupplierContactCard 
            key={s.id} 
            supplier={s} 
            isAdmin={isAdmin} 
            onEdit={openEdit} 
            onDelete={handleDelete}
          />
        ))}
      </div>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }
        
        /* NUCLEAR SHIELD: Removes browser auto-fill stickers */
        input::-webkit-contacts-auto-fill-button, 
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          display: none !important;
          pointer-events: none;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px black inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

const InputBox = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2 text-left relative">
    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">{label}</label>
    <input 
      required 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="bg-black border border-white/10 p-5 text-xs font-bold tracking-widest outline-none focus:border-[#D4AF37] transition-all relative z-10" 
    />
  </div>
);

export default SupplierRegistry;