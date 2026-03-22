import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Bell, ClipboardList, CheckCircle, Clock } from 'lucide-react';

const StaffDashboard = () => {
  const [notices, setNotices] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Staff Member"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/staff")
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.error("Notice system unreachable."));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-3">Operational Portal</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Welcome, {user.name}</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Shift Status</p>
          <p className="text-[#D4AF37] font-black uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} /> Active Session
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: INTERNAL NOTICES  */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-[#D4AF37]" size={20} />
            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-gray-400">Management Notices</h3>
          </div>
          
          <div className="space-y-4">
            {notices.length > 0 ? notices.map((notice) => (
              <div key={notice.id} className="p-6 bg-white/[0.03] border border-white/5 hover:border-[#D4AF37]/30 transition-all group">
                <h4 className="text-[#D4AF37] text-[11px] font-black uppercase mb-2 tracking-widest">{notice.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{notice.message}</p>
                <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                  <CheckCircle size={12} /> Acknowledge Receipt
                </button>
              </div>
            )) : (
              <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">No active notices.</p>
            )}
          </div>
        </div>

        {/* RIGHT: OPERATIONAL TOOLS  */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           <OpCard 
             icon={<Package size={32}/>} 
             title="Inventory Control" 
             desc="Update stock quantities and add new products." 
             action="Manage Stock"
           />
           <OpCard 
             icon={<ClipboardList size={32}/>} 
             title="Order Processing" 
             desc="Monitor and update active customer orders." 
             action="View Orders"
           />
        </div>
      </div>
    </div>
  );
};

const OpCard = ({ icon, title, desc, action }) => (
  <div className="p-10 bg-white/[0.01] border border-white/5 hover:bg-[#D4AF37]/5 transition-all group">
    <div className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black uppercase tracking-tight mb-3">{title}</h3>
    <p className="text-xs text-gray-500 mb-8 leading-relaxed">{desc}</p>
    <button className="w-full py-4 border border-[#D4AF37]/30 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all">
      {action}
    </button>
  </div>
);

export default StaffDashboard;