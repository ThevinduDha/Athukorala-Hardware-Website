import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Clock, User, Activity, 
  LayoutDashboard, Package, Users, Settings, LogOut, Globe, BarChart3, ChevronRight,
  Megaphone, Tag
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuditLogView = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Administrator"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/audit/logs")
      .then(res => res.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Security Archive Offline"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden text-left">
      
      {/* --- ELITE ANIMATED SIDEBAR (EXACT MATCH TO DASHBOARD) --- */}
      <motion.aside 
        initial={{ x: -280 }} 
        animate={{ x: 0 }} 
        transition={{ type: "spring", damping: 20 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2 text-left">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 10px rgba(212,175,55,0.1)", "0 0 30px rgba(212,175,55,0.4)", "0 0 10px rgba(212,175,55,0.1)"],
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="p-2 bg-[#D4AF37] rounded-sm shadow-2xl"
          >
            <Activity className="text-black" size={24} />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
            <span className="text-[7px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mt-1">Industrial OS</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {/* UPDATED: Buttons now navigate to Dashboard with instructions on which tab to open */}
          <NavItem icon={<LayoutDashboard size={18}/>} label="Command Center" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'command' } })} />
          <NavItem icon={<Megaphone size={18}/>} label="Broadcast Hub" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'broadcast' } })} />
          <NavItem icon={<Package size={18}/>} label="Inventory Stock" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'inventory' } })} />
          <NavItem icon={<Tag size={18}/>} label="Promotions & Deals" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'promotions' } })} />
          <NavItem icon={<Users size={18}/>} label="Personnel Registry" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'clients' } })} />
          
          <NavItem icon={<ShieldAlert size={18}/>} label="Security Audit" active={true} />
          
          <NavItem icon={<BarChart3 size={18}/>} label="Financials" onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'financials' } })} />
          
          <NavItem icon={<Settings size={18}/>} label="System Config" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <motion.button 
            whileHover={{ x: 5, color: "#ef4444" }}
            onClick={handleLogout} 
            className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 transition-all text-[10px] font-bold uppercase tracking-widest group text-left"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </motion.button>
        </div>
      </motion.aside>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-12 overflow-y-auto relative text-left"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />

        <motion.header variants={itemVariants} className="mb-16 text-left">
          <div className="flex items-center gap-3 mb-4 text-left">
            <ShieldAlert size={14} className="text-[#D4AF37]" />
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase text-left">Security Protocol</p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-left">
            System <span className="text-transparent stroke-text">Audit Log</span>
          </h1>
        </motion.header>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
          <StatBox label="Total Actions Logged" val={`${logs.length} EVENTS`} />
          <StatBox label="Current Session" val={user.name} color="text-[#D4AF37]" border="border-l-[#D4AF37]" />
          <StatBox label="System Health" val="Encrypted" color="text-green-500" />
        </motion.div>

        <motion.div variants={itemVariants} className="border border-white/5 bg-white/[0.01] backdrop-blur-md text-left">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-[10px] tracking-[0.3em] uppercase text-gray-500 font-bold">
                        <th className="p-6">Protocol / Action</th>
                        <th className="p-6">Operator</th>
                        <th className="p-6">Execution Details</th>
                        <th className="p-6 text-right">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="text-xs">
                    {logs.map((log) => (
                        <motion.tr 
                            variants={itemVariants}
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)", x: 5 }}
                            key={log.id} 
                            className="border-b border-white/5 transition-all group cursor-default text-left"
                        >
                            <td className="p-6 text-left">
                                <div className="flex items-center gap-3 text-left">
                                    <Activity size={14} className="text-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="font-black uppercase tracking-widest">{log.action}</span>
                                </div>
                            </td>
                            <td className="p-6 text-gray-400 font-bold uppercase tracking-widest text-[10px] text-left">
                                {log.performedBy}
                            </td>
                            <td className="p-6 text-gray-500 italic font-medium text-left">
                                "{log.details}"
                            </td>
                            <td className="p-6 text-right text-gray-600 font-mono text-[10px]">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
      </motion.main>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

const StatBox = ({ label, val, color = "text-white", border = "border-white/5" }) => (
  <motion.div 
    whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.05)" }}
    className={`bg-white/[0.02] border ${border} p-6 transition-colors text-left`}
  >
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 text-left">{label}</p>
    <p className={`text-2xl font-black ${color} uppercase text-left`}>{val}</p>
  </motion.div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <motion.button 
    whileHover={{ x: 8 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 relative overflow-hidden group ${active ? 'bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    <div className="flex items-center gap-5 relative z-10 text-[11px] uppercase tracking-widest text-left">
      <motion.span animate={active ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }}>
        {icon}
      </motion.span> 
      {label}
    </div>
    {active && <motion.div initial={{ x: -10 }} animate={{ x: 0 }}><ChevronRight size={14} className="relative z-10" /></motion.div>}
    {!active && (
        <motion.div 
          className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent group-hover:w-full transition-all" 
          initial={false}
          transition={{ duration: 0.4 }}
        />
    )}
  </motion.button>
);

export default AuditLogView;