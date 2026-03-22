import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Shield, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ClientRegistry = () => {
  const [customers, setCustomers] = useState([]);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteToStaff = async (id) => {
    if (window.confirm("CONFIRM: PROMOTE THIS USER TO OPERATIONAL STAFF?")) {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("STAFF"),
        });
        if (res.ok) {
          toast.success("User Promoted to Staff Role");
          fetchUsers(); // Refresh list
        }
      } catch (err) {
        toast.error("Promotion Protocol Failed");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <header className="mb-12">
        <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">User Management</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Client Registry</h2>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {customers.map((customer) => (
          <motion.div 
            key={customer.id}
            whileHover={{ x: 10, borderColor: 'rgba(212, 175, 55, 0.3)' }}
            className="p-8 bg-white/[0.02] border border-white/5 flex justify-between items-center transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <Users className="text-[#D4AF37]" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{customer.name}</h3>
                <p className="text-[10px] text-gray-500 font-mono">{customer.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => promoteToStaff(customer.id)}
                className="flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <UserPlus size={14} /> Promote to Staff
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClientRegistry;