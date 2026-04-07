import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Bell,
  CheckCircle,
  LayoutDashboard,
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StaffInventoryControl from '../components/StaffInventoryControl';

const sweepVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'circOut' }
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: 'blur(10px)',
    transition: { duration: 0.3 }
  }
};

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('portal');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Operator"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/staff")
      .then(res => res.json())
      .then(data => {
        setNotices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Notice system unreachable.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-white/10 bg-black/45 backdrop-blur-2xl p-8 flex flex-col gap-10 relative z-50 h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_22px_rgba(212,175,55,0.18)]">
            <Activity className="text-black" size={22} />
          </div>

          <div className="flex flex-col">
            <span className="font-black tracking-[0.3em] uppercase text-sm">
              Athukorala
            </span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mt-1">
              Operational Node
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Operational Portal"
            active={activeTab === 'portal'}
            onClick={() => setActiveTab('portal')}
          />
          <NavItem
            icon={<Package size={18} />}
            label="Inventory Control"
            active={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
          />
          <NavItem
            icon={<Bell size={18} />}
            label="Internal Notices"
            active={activeTab === 'notices'}
            onClick={() => setActiveTab('notices')}
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 lg:px-10 py-8 lg:py-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          {/* PORTAL */}
          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-10"
            >
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                  OPERATIONAL PORTAL
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-white">
                  Welcome, {user.name.split(' ')[0]}
                </h2>
                <p className="text-gray-400 text-sm mt-3 max-w-2xl">
                  Monitor notices, inventory tasks, and daily warehouse operations from one secure interface.
                </p>

                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-5 py-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.22em]">
                    Active Session
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* NOTICES WIDGET */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                    <div className="flex items-center gap-3 mb-5">
                      <Bell className="text-[#D4AF37]" size={16} />
                      <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                        Management Notices
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {loading ? (
                        <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                      ) : notices.length > 0 ? (
                        notices.slice(0, 4).map(notice => (
                          <div
                            key={notice.id}
                            className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 hover:border-[#D4AF37]/25 transition-all relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D4AF37] opacity-60" />
                            <h4 className="text-[#D4AF37] text-[11px] font-black uppercase mb-2 tracking-widest">
                              {notice.title}
                            </h4>
                            <p className="text-xs text-gray-400 italic mb-4 line-clamp-3">
                              "{notice.message}"
                            </p>
                            <button className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                              <CheckCircle size={10} /> Acknowledge Receipt
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic py-8 text-center">
                          No internal notices found.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* MAIN ACTION CARD */}
                <div className="lg:col-span-8">
                  <OpCard
                    icon={<Package size={48} />}
                    title="Inventory Control"
                    desc="Execute real-time stock adjustments, manage physical hardware assets, and synchronize warehouse registries with the core database for immediate fulfillment accuracy."
                    action="Manage Stock"
                    onClick={() => setActiveTab('inventory')}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* INVENTORY */}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                  STOCK PROTOCOL
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-white">
                  Inventory Control
                </h2>
                <p className="text-gray-400 text-sm mt-3 max-w-2xl">
                  Manage and update stock levels in real-time with secure inventory controls.
                </p>
              </div>

              <StaffInventoryControl />
            </motion.div>
          )}

          {/* NOTICES */}
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                  ARCHIVE HUB
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-white">
                  Internal Notices
                </h2>
                <p className="text-gray-400 text-sm mt-3 max-w-2xl">
                  View and manage internal staff communications and operational announcements.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {notices.length > 0 ? (
                  notices.map(notice => (
                    <div
                      key={notice.id}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 relative overflow-hidden hover:border-[#D4AF37]/25 transition-all"
                    >
                      <div className="absolute top-0 left-0 w-[3px] h-full bg-[#D4AF37] opacity-30" />
                      <h3 className="text-[#D4AF37] font-black uppercase tracking-widest mb-4">
                        {notice.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {notice.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-gray-600 uppercase">
                        <span>Issued: {new Date().toLocaleDateString()}</span>
                        <span className="flex items-center gap-2">
                          <CheckCircle size={12} />
                          Verified Protocol
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center text-gray-500">
                    No notices available.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .stroke-text {
            -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5);
            color: transparent;
          }
        `}</style>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
      active
        ? 'bg-[#D4AF37] text-black font-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]'
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-5 text-[11px] font-black tracking-[0.2em] uppercase">
      {icon} {label}
    </div>
    {active && <ChevronRight size={14} />}
  </button>
);

const OpCard = ({ icon, title, desc, action, onClick }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 lg:p-10 hover:border-[#D4AF37]/35 transition-all group flex flex-col items-start shadow-[0_20px_60px_rgba(0,0,0,0.25)] h-full"
  >
    <div className="text-[#D4AF37] mb-8 p-6 rounded-3xl bg-black/30 border border-white/10 group-hover:border-[#D4AF37]/40 transition-colors shadow-inner">
      {icon}
    </div>

    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
      {title}
    </h3>

    <p className="text-sm text-gray-400 mb-12 leading-relaxed max-w-xl">
      {desc}
    </p>

    <button
      onClick={onClick}
      className="w-full rounded-2xl py-5 border border-[#D4AF37]/20 text-[11px] font-black uppercase tracking-[0.38em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group/btn shadow-lg"
    >
      {action}
      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

export default StaffDashboard;