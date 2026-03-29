import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Database, Shield, 
  Globe, Bell, RefreshCw, HardDrive, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SystemConfig = () => {
  const [config, setConfig] = useState({
    systemName: "ATHUKORALA INDUSTRIAL",
    lowStockThreshold: 10,
    maintenanceMode: false,
    autoBackup: true,
    currency: "LKR"
  });

  // --- SECURITY HANDSHAKE: Trigger on Component Mount ---
  useEffect(() => {
    toast("CORE ACCESS GRANTED: SYSTEM PARAMETERS EXPOSED", {
      icon: '🔐',
      style: { 
        borderRadius: '0px', 
        background: '#050505', 
        color: '#D4AF37', 
        border: '1px solid #D4AF37', 
        fontSize: '10px', 
        fontWeight: 'bold',
        letterSpacing: '0.1em'
      }
    });
  }, []);

  const handleSave = () => {
    const loading = toast.loading("RECONFIGURING CORE PROTOCOLS...");
    
    // Logic: In a real app, you would fetch() to update a 'settings' table in MySQL
    setTimeout(() => {
      toast.success("SYSTEM PARAMETERS UPDATED & COMMITTED", { 
        id: loading,
        style: { borderRadius: '0px', background: '#D4AF37', color: '#000', fontWeight: '900', fontSize: '10px' }
      });
    }, 1500);
  };

  return (
    <div className="space-y-12 text-left">
      <header className="mb-10 text-left">
        <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
          <Settings size={14} className="animate-spin-slow" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em]">Core Control Unit</p>
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
          System <span className="text-transparent stroke-text">Config</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-left">
        {/* --- GLOBAL IDENTITY --- */}
        <section className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Globe size={120} />
          </div>
          
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-8 flex items-center gap-3">
            <Shield size={14} /> Global Identity
          </h3>
          
          <div className="space-y-6 relative z-10">
            <ConfigInput 
              label="System Designation" 
              value={config.systemName} 
              onChange={(v) => setConfig({...config, systemName: v.toUpperCase()})} 
            />
            
            <div className="grid grid-cols-2 gap-4">
               <div className="text-left">
                 <ConfigInput label="Base Currency" value={config.currency} onChange={(v) => setConfig({...config, currency: v.toUpperCase()})} />
               </div>
               <div className="text-left flex flex-col justify-end">
                 <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Protocol Status</label>
                 <button 
                  onClick={() => {
                    setConfig({...config, maintenanceMode: !config.maintenanceMode});
                    toast(config.maintenanceMode ? "SYSTEM RESTORED TO LIVE STATUS" : "SYSTEM ENTERING MAINTENANCE PROTOCOL", {
                        style: { borderRadius: '0px', background: '#000', color: config.maintenanceMode ? '#22c55e' : '#ef4444', fontSize: '9px', fontWeight: 'bold' }
                    });
                  }}
                  className={`w-full py-4 px-4 border text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${config.maintenanceMode ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-green-600/10 border-green-500/30 text-green-500'}`}
                 >
                   {config.maintenanceMode ? <AlertTriangle size={14}/> : <ShieldCheck size={14}/>}
                   {config.maintenanceMode ? "Maintenance: ACTIVE" : "System: ONLINE"}
                 </button>
               </div>
            </div>
          </div>
        </section>

        {/* --- AUTOMATION THRESHOLDS --- */}
        <section className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl relative group text-left">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database size={100} />
          </div>

          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-8 flex items-center gap-3">
            <RefreshCw size={14} /> Threshold Protocols
          </h3>
          
          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-center text-left bg-black/40 p-4 border border-white/5">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                    <Bell size={12} className="text-[#D4AF37]"/> Low Stock Alert Level
                </p>
                <p className="text-[9px] text-gray-500 uppercase mt-1">Triggers dashboard warnings when units fall below</p>
              </div>
              <input 
                type="number" 
                value={config.lowStockThreshold}
                onChange={(e) => setConfig({...config, lowStockThreshold: e.target.value})}
                className="w-20 bg-black border border-white/10 p-3 text-center font-mono text-[#D4AF37] outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <ToggleSwitch 
              label="Automated Registry Backup" 
              desc="Daily snapshots of MySQL database to cloud storage"
              active={config.autoBackup}
              onClick={() => setConfig({...config, autoBackup: !config.autoBackup})}
            />
            
            <div className="pt-4 border-t border-white/5 flex items-center gap-4 text-gray-600">
                <HardDrive size={16} />
                <span className="text-[8px] font-black uppercase tracking-widest">Database Node: localhost:3306</span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-6">
        <button 
            onClick={handleSave}
            className="px-12 py-6 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] flex items-center gap-4 active:scale-95"
        >
            <Save size={18} /> Commit Changes to Core
        </button>
        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest max-w-[200px]">
            *Changes made here impact global business rules immediately.
        </p>
      </div>

      <style>{`.animate-spin-slow { animation: spin 10s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

const ConfigInput = ({ label, value, onChange }) => (
  <div className="text-left group">
    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2 group-focus-within:text-[#D4AF37] transition-colors">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest text-white outline-none focus:border-[#D4AF37] transition-all shadow-inner"
    />
  </div>
);

const ToggleSwitch = ({ label, desc, active, onClick }) => (
  <div className="flex justify-between items-center text-left">
    <div className="text-left">
      <p className="text-[10px] font-black uppercase text-white tracking-widest">{label}</p>
      <p className="text-[9px] text-gray-500 uppercase mt-1">{desc}</p>
    </div>
    <div 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${active ? 'bg-[#D4AF37]' : 'bg-gray-800'}`}
    >
      <motion.div 
        animate={{ x: active ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
      />
    </div>
  </div>
);

export default SystemConfig;