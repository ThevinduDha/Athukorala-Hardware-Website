import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Users, Settings, LogOut, 
  Activity, BarChart3, Bell, Search, ShieldCheck, 
  TrendingUp, ArrowUpRight, Globe, ShieldAlert, Clock,
  Percent, Tag, Megaphone, Send, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // UPDATED: Added useLocation
import { toast } from 'react-hot-toast';
import AddProductModal from './AddProductModal';
import InventoryList from './InventoryList';
import LowStockWidget from '../components/LowStockWidget';
import PersonnelRegistry from './PersonnelRegistry';
import StaffNoticeManager from '../components/StaffNoticeManager';
import DiscountSuggestionPanel from '../components/DiscountSuggestionPanel'; 
import PromotionManager from '../components/PromotionManager';
import ActivePromotionList from '../components/ActivePromotionList';
import PromotionNoticeManager from '../components/PromotionNoticeManager';
import NoticeArchive from '../components/NoticeArchive';
import Financials from './Financials'; // NEW: Import the page we just built
import SystemConfig from './SystemConfig';

// --- ANIMATION VARIANTS CONFIGURATION ---
const panelVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: "circOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const AuditPreviewWidget = () => {
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch("http://localhost:8080/api/audit/logs")
        .then(res => res.json())
        .then(data => setRecentLogs(Array.isArray(data) ? data.slice(0, 4) : []))
        .catch(err => console.error("Audit Stream Offline"));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      variants={panelVariants}
      className="p-10 border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group min-h-[400px] shadow-2xl"
    >
      <motion.div 
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[2px] bg-[#D4AF37] opacity-50" 
      />
      
      <div className="flex justify-between items-center mb-10 text-left">
        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-gray-400">System Integrity • Live Feed</h3>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-green-500 tracking-widest uppercase">Live Data</span>
        </div>
      </div>
      <div className="space-y-6 text-left">
        <AnimatePresence mode="popLayout">
          {recentLogs.length > 0 ? recentLogs.map((log, i) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex justify-between items-center border-b border-white/5 pb-4 group cursor-pointer hover:border-[#D4AF37]/30 transition-all text-left"
            >
              <div className="flex gap-5 items-center text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] group-hover:scale-150 transition-transform" />
                <div className="text-left">
                  <p className="text-sm font-bold tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors text-left">{log.action}</p>
                  <p className="text-[9px] text-gray-600 font-bold tracking-widest uppercase text-left">{log.performedBy} — {log.details}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </motion.div>
          )) : (
              <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center py-20 italic">Monitoring encrypted streams...</p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // NEW: Hook to access instruction from other pages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('command'); 
  const [promoRefreshTrigger, setPromoRefreshTrigger] = useState(0); 
  const [archiveRefresh, setArchiveRefresh] = useState(0);

  // NEW: State for current modification target (UPDATE PART)
  const [editingPromo, setEditingPromo] = useState(null);

  // NEW: State to hold the product selected from AI panel for auto-fill
  const [preSelectedProduct, setPreSelectedProduct] = useState(null);

  // NEW: EFFECT TO HANDLE INBOUND NAVIGATION INSTRUCTIONS (Fix for Financials button)
  useEffect(() => {
    if (location.state && location.state.targetTab) {
      setActiveTab(location.state.targetTab);
      // Clean up the history state so refreshing doesn't force the tab back
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Administrator"}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // HANDLER: Triggered when "Apply Discount" is clicked in the AI Panel
  const handleApplyDiscountFromAI = (product) => {
    setPreSelectedProduct(product);
    setActiveTab('promotions');
    toast.success(`AUTHORIZING DISCOUNT FOR: ${product.name}`, {
        icon: '⚡',
        style: { borderRadius: '0px', background: '#050505', color: '#D4AF37', border: '1px solid #D4AF37', fontSize: '10px', fontWeight: '900' }
    });
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden text-left">
      
      {/* --- ELITE ANIMATED SIDEBAR --- */}
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
          <NavItem icon={<LayoutDashboard size={18}/>} label="Command Center" active={activeTab === 'command'} onClick={() => setActiveTab('command')} />
          <NavItem icon={<Megaphone size={18}/>} label="Broadcast Hub" active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} />
          <NavItem icon={<Package size={18}/>} label="Inventory Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Tag size={18}/>} label="Promotions & Deals" active={activeTab === 'promotions'} onClick={() => setActiveTab('promotions')} />
          <NavItem icon={<Users size={18}/>} label="Personnel Registry" active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
          <NavItem icon={<ShieldAlert size={18}/>} label="Security Audit" onClick={() => navigate('/admin/audit-logs')} />
          <NavItem icon={<BarChart3 size={18}/>} label="Financials" active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} />
          <NavItem icon={<Settings size={18}/>} label="System Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <motion.button 
            whileHover={{ x: 5, color: "#ef4444" }}
            onClick={handleLogout} 
            className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 transition-all text-[10px] font-bold uppercase tracking-widest group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </motion.button>
        </div>
      </motion.aside>

      <main className="flex-1 p-12 overflow-y-auto relative text-left">
        {/* INTERACTIVE BACKGROUND AURA */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37] blur-[150px] rounded-full -z-10" 
        />

        <header className="flex justify-between items-start mb-16 text-left">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-3 text-left">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ShieldCheck size={14} className="text-[#D4AF37]" />
              </motion.div>
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] text-left">
                {activeTab === 'clients' ? 'Protocol: Personnel Management' : activeTab === 'financials' ? 'Protocol: Fiscal Intelligence' : activeTab === 'config' ? 'Protocol: Core Reconfiguration' : 'Protocol Status: Senior Admin'}
              </p>
            </div>
            {/* DYNAMIC HEADER FIX: Centralized title logic */}
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-left">
              {activeTab === 'clients' ? 'Personnel' : 
               activeTab === 'financials' ? 'Fiscal' : 
               activeTab === 'config' ? 'System' : 
               activeTab === 'broadcast' ? 'Broadcast' : 
               activeTab === 'promotions' ? 'Promotion' : 
               activeTab === 'inventory' ? 'Inventory' : 'Welcome,'} 
              <span className="text-transparent stroke-text ml-4">
                {activeTab === 'clients' ? 'Registry' : 
                 activeTab === 'financials' ? 'Analysis' : 
                 activeTab === 'config' ? 'Config' : 
                 activeTab === 'broadcast' ? 'Hub' : 
                 activeTab === 'promotions' ? 'Registry' : 
                 activeTab === 'inventory' ? 'Stock' : user.name}
              </span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-8">
            <motion.div whileFocus={{ scale: 1.05 }} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37]" size={16} />
              <input type="text" placeholder="SEARCH REGISTRY..." className="bg-white/5 border border-white/10 py-3 pl-10 pr-6 text-[10px] tracking-widest outline-none focus:border-[#D4AF37] transition-all w-64 uppercase font-bold text-left shadow-lg" />
            </motion.div>
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-[#D4AF37]/20 transition-all shadow-xl"
            >
              <Bell size={20} className="text-[#D4AF37]" />
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#050505] rounded-full" 
              />
            </motion.div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'command' && (
            <motion.div key="command" initial="initial" animate="animate" exit="exit" variants={panelVariants} className="space-y-12 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <StatCard icon={<Package/>} label="Active Inventory" val="14,208" sub="Units in stock" trend="+12.5%" />
                <StatCard icon={<TrendingUp/>} label="Daily Revenue" val="LKR 425K" sub="Verified Transactions" trend="+8.2%" />
                <StatCard icon={<Users/>} label="Total Clients" val="2,148" sub="Database Entries" trend="+4%" />
              </div>
              
              <motion.div variants={panelVariants}>
                <DiscountSuggestionPanel onApplyClick={handleApplyDiscountFromAI} />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                <div className="lg:col-span-2">
                  <AuditPreviewWidget />
                </div>
                <motion.div variants={panelVariants} className="flex flex-col gap-8 text-left">
                  <LowStockWidget />
                  <div className="p-10 border border-white/5 bg-[#D4AF37]/5 backdrop-blur-md flex flex-col justify-between text-left shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80} /></div>
                    <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-8 text-left">Quick Operations</h3>
                    <div className="space-y-4">
                      <ActionButton label="Add New Product" onClick={() => setIsModalOpen(true)} />
                      <ActionButton label="Generate Report" onClick={() => navigate('/admin/reports')} />
                      <ActionButton label="Stock Audit View" onClick={() => navigate('/admin/audit-logs')} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'broadcast' && (
            <motion.div key="broadcast" initial="initial" animate="animate" exit="exit" variants={panelVariants} className="space-y-12 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
                <section className="space-y-6 text-left text-left"><div className="flex items-center gap-3 text-left"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /><h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 text-left">Internal Staff Protocol</h2></div><StaffNoticeManager onSuccess={() => setArchiveRefresh(prev => prev + 1)} /></section>
                <section className="space-y-6 text-left text-left"><div className="flex items-center gap-3 text-left"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" /><h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] text-left">Customer Promotion Engine</h2></div><PromotionNoticeManager onSuccess={() => setArchiveRefresh(prev => prev + 1)} /></section>
              </div>
              <motion.div variants={panelVariants}><NoticeArchive refreshTrigger={archiveRefresh} /></motion.div>
            </motion.div>
          )}

          {activeTab === 'promotions' && (
            <motion.div key="promotions" initial="initial" animate="animate" exit="exit" variants={panelVariants} className="space-y-12 text-left">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 text-left text-left">
                <div className="xl:col-span-7">
                   <PromotionManager 
                     preSelected={preSelectedProduct} 
                     editingItem={editingPromo}
                     onCancelEdit={() => setEditingPromo(null)}
                     onSuccess={() => { 
                       setPromoRefreshTrigger(prev => prev + 1); 
                       setPreSelectedProduct(null); 
                       setEditingPromo(null); 
                     }} 
                   />
                </div>
                <div className="xl:col-span-5 bg-white/[0.02] border border-white/5 p-10 backdrop-blur-xl text-left shadow-2xl">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-8 text-left">Active Protocols</h3>
                   <ActivePromotionList 
                     refreshTrigger={promoRefreshTrigger} 
                     onEdit={(promo) => setEditingPromo(promo)}
                   />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div key="config" initial="initial" animate="animate" exit="exit" variants={panelVariants}>
              <SystemConfig />
            </motion.div>
          )}

          {activeTab === 'financials' && (
            <motion.div key="financials" initial="initial" animate="animate" exit="exit" variants={panelVariants}>
              <Financials />
            </motion.div>
          )}

          {activeTab === 'inventory' && (<motion.div key="inventory" initial="initial" animate="animate" exit="exit" variants={panelVariants} className="text-left"><InventoryList /></motion.div>)}
          {activeTab === 'clients' && (<motion.div key="clients" initial="initial" animate="animate" exit="exit" variants={panelVariants} className="text-left"><PersonnelRegistry /></motion.div>)}
        </AnimatePresence>
      </main>

      <AnimatePresence>{isModalOpen && (<AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />)}</AnimatePresence>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <motion.button whileHover={{ x: 8 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 relative overflow-hidden group ${active ? 'bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <div className="flex items-center gap-5 relative z-10 text-[11px] uppercase tracking-widest text-left"><motion.span animate={active ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }}>{icon}</motion.span>{label}</div>
    {active && <motion.div initial={{ x: -10 }} animate={{ x: 0 }}><ChevronRight size={14} className="relative z-10" /></motion.div>}
    {!active && (<motion.div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent group-hover:w-full transition-all" initial={false} transition={{ duration: 0.4 }} />)}
  </motion.button>
);

const StatCard = ({ icon, label, val, sub, trend }) => (
  <motion.div whileHover={{ y: -10, scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.4)' }} className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all group relative text-left shadow-xl"><div className="absolute top-8 right-8 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/30 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">{React.cloneElement(icon, { size: 60 })}</div><p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-3 text-left">{label}</p><h3 className="text-5xl font-black tracking-tighter mb-2 text-left group-hover:text-[#D4AF37] transition-colors">{val}</h3><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6 text-left">{sub}</p><motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/5 w-fit px-3 py-1 border border-[#D4AF37]/10 shadow-lg"><ArrowUpRight size={12} /> {trend} </motion.div></motion.div>
);

const ActionButton = ({ label, onClick }) => (
  <motion.button whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="w-full py-5 px-6 border border-white/10 hover:border-[#D4AF37] hover:bg-white/5 transition-all text-left text-[10px] font-black uppercase tracking-[0.3em] flex justify-between items-center group shadow-md"><span className="group-hover:text-[#D4AF37] transition-colors">{label}</span><motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowUpRight size={14} className="text-[#D4AF37]" /></motion.div></motion.button>
);

export default AdminDashboard;