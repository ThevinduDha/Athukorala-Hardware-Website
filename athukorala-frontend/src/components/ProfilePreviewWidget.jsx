import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, MapPin, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePreviewWidget = () => {
  const navigate = useNavigate();
  // Retrieves the authenticated user data [cite: 61, 87]
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest User"}');

  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.4)' }}
      className="p-8 bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group text-left transition-all"
    >
      {/* AUTHENTICATION STATUS INDICATOR */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-30 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 bg-[#D4AF37]/10 rounded-sm border border-[#D4AF37]/20">
          <User className="text-[#D4AF37]" size={20} />
        </div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-green-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Session Secure</span>
        </div>
      </div>

      <div className="space-y-1 mb-8">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Account Protocol</p>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{user.name}</h3>
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin size={12} className="text-[#D4AF37]" />
          <span className="text-[10px] font-bold truncate max-w-[200px] uppercase tracking-wider">
            {user.address || "No Address on Registry"} [cite: 73]
          </span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/profile')}
        className="w-full py-4 border border-white/10 flex items-center justify-between px-6 group/btn hover:bg-white hover:text-black transition-all"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Manage Personal Registry</span>
        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>

      {/* ROLE VERIFICATION BADGE */}
      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">
          <ShieldCheck size={12} /> Authorized Role: {user.role || 'CUSTOMER'} [cite: 96]
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePreviewWidget;