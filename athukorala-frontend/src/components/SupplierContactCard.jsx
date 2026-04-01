import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Building2, Trash2, Edit3, UserCheck } from 'lucide-react';

const SupplierContactCard = ({ supplier, isAdmin, onEdit, onDelete }) => {
  if (!supplier) return (
    <div className="p-6 border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-gray-600">
      No Supplier Linked to this Asset
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.01] border border-white/5 hover:border-[#D4AF37]/30 p-8 relative overflow-hidden group transition-all"
    >
      {/* Decorative Background Icon */}
      <Building2 className="absolute -right-4 -bottom-4 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors" size={120} />

      <header className="mb-6 flex justify-between items-start relative z-10">
        <div>
          <p className="text-[#D4AF37] text-[9px] font-black tracking-[0.4em] uppercase mb-1">{supplier.category || "General"} Vendor</p>
          <h4 className="text-2xl font-black uppercase tracking-tighter">{supplier.name}</h4>
        </div>
        
        {/* ADMIN CONTROLS */}
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => onEdit(supplier)} className="p-2 bg-white/5 text-gray-500 hover:text-[#D4AF37] transition-colors">
              <Edit3 size={14} />
            </button>
            <button onClick={() => onDelete(supplier.id, supplier.name)} className="p-2 bg-white/5 text-gray-500 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </header>

      <div className="space-y-4 relative z-10">
        <ContactLine icon={<UserCheck size={14}/>} label="Point of Contact" value={supplier.contactPerson || "N/A"} />
        <ContactLine icon={<Phone size={14}/>} label="Direct Line" value={supplier.phoneNumber || "N/A"} />
        <ContactLine icon={<Mail size={14}/>} label="Protocol Email" value={supplier.email || "N/A"} />
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 relative z-10">
        <a href={`tel:${supplier.phoneNumber}`} className="flex-1 bg-[#D4AF37] text-black text-[10px] font-black uppercase py-3 text-center hover:bg-white transition-all shadow-lg">
          Call Now
        </a>
        <a href={`mailto:${supplier.email}`} className="flex-1 border border-white/10 text-white text-[10px] font-black uppercase py-3 text-center hover:bg-white/5 transition-all">
          Email PO
        </a>
      </div>
    </motion.div>
  );
};

const ContactLine = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-[#D4AF37] opacity-60">{icon}</div>
    <div className="text-left">
      <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-medium text-gray-300 tracking-wide">{value}</p>
    </div>
  </div>
);

export default SupplierContactCard;