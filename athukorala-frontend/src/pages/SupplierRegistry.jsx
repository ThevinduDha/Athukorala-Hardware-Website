import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SupplierContactCard from '../components/SupplierContactCard';

const SupplierRegistry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const isAdmin = user.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    category: 'GENERAL'
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/suppliers/all");
      const data = await res.json();
      setSuppliers(data);
    } catch {
      toast.error("SUPPLIER DATABASE OFFLINE");
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const validate = () => {
    const phoneRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (formData.name.length < 3) return "COMPANY NAME TOO SHORT";
    if (!emailRegex.test(formData.email)) return "INVALID EMAIL";
    if (!phoneRegex.test(formData.phoneNumber)) return "INVALID PHONE NUMBER";

    return null;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    const loading = toast.loading(editingId ? "Updating..." : "Registering...");

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
        toast.success(editingId ? "Updated" : "Registered", { id: loading });
        closeForm();
        fetchSuppliers();
      }
    } catch {
      toast.error("Action Failed", { id: loading });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    const loading = toast.loading("Deleting...");

    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success("Deleted", { id: loading });
        fetchSuppliers();
      }
    } catch {
      toast.error("Delete Failed", { id: loading });
    }
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
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      category: 'GENERAL'
    });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
              Vendor Control
            </p>
            <h2 className="text-3xl font-black text-white">
              Supplier Registry
            </h2>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/20 transition"
            >
              {showAdd ? <X size={16} /> : <Plus size={16} />}
              {showAdd ? "Close Form" : "Add Supplier"}
            </button>
          )}
        </div>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleAction}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
          >
            <InputBox label="Company Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
            <InputBox label="Contact Person" value={formData.contactPerson} onChange={v => setFormData({...formData, contactPerson: v})} />
            <InputBox label="Email" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
            <InputBox label="Phone" value={formData.phoneNumber} onChange={v => setFormData({...formData, phoneNumber: v})} />

            <select
              className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>GENERAL</option>
              <option>PAINTS</option>
              <option>TOOLS</option>
              <option>ELECTRICAL</option>
            </select>

            <button
              type="submit"
              className="bg-[#D4AF37] text-black rounded-xl font-bold py-4 hover:bg-white transition"
            >
              {editingId ? "Update Supplier" : "Add Supplier"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* SUPPLIER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

const InputBox = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-400">{label}</label>
    <input
      required
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#D4AF37]"
    />
  </div>
);

export default SupplierRegistry;