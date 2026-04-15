import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  BarChart3,
  ChevronRight,
  Megaphone,
  Tag,
  Clock,
  User,
  Database,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  }
};

const AuditLogView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Administrator"}');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8080/api/audit/logs?";

      if (typeFilter !== "ALL") url += `type=${typeFilter}&`;
      if (dateFilter !== "ALL") url += `range=${dateFilter}`;

      const res = await fetch(url);
      const data = await res.json();

      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('SECURITY ARCHIVE OFFLINE');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchLogs();
    }, [typeFilter, dateFilter]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

    // 🔥 PREMIUM PDF GENERATOR
    const generatePDF = () => {
      const doc = new jsPDF();

      // 🔥 HEADER DESIGN
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 210, 30, "F");

      doc.setTextColor(212, 175, 55);
      doc.setFontSize(18);
      doc.text("ATHUKORALA TRADERS", 105, 15, { align: "center" });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Security Audit Report", 105, 22, { align: "center" });

      // 🔥 FILTER INFO
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Filter: ${typeFilter} | ${dateFilter}`, 14, 40);

      const now = new Date();
      doc.text(`Generated: ${now.toLocaleString()}`, 14, 48);

      // 🔥 TABLE DATA
      const tableColumn = ["Action", "Operator", "Details", "Time"];

      const tableRows = logs.map((log) => [
        log.action,
        log.performedBy || "SYSTEM",
        log.details,
        new Date(log.timestamp).toLocaleString(),
      ]);

      // 🔥 AUTO TABLE
      autoTable(doc, {
        startY: 55,
        head: [tableColumn],
        body: tableRows,

        styles: {
          fontSize: 9,
          cellPadding: 4,
        },

        headStyles: {
          fillColor: [212, 175, 55],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },

        bodyStyles: {
          textColor: [0, 0, 0],
        },

        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },

        margin: { top: 55 },

        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            "Athukorala Traders - Secure Audit System",
            105,
            290,
            { align: "center" }
          );
        },
      });

      doc.save("audit_report.pdf");
    };
      


  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 10px rgba(212,175,55,0.1)',
                '0 0 30px rgba(212,175,55,0.35)',
                '0 0 10px rgba(212,175,55,0.1)'
              ],
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="p-2.5 bg-[#D4AF37] rounded-xl shadow-2xl"
          >
            <Activity className="text-black" size={24} />
          </motion.div>

          <div className="flex flex-col">
            <span className="font-black tracking-[0.3em] uppercase text-sm">
              Athukorala
            </span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.22em] uppercase mt-1">
              Industrial OS
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Command Center"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'command' } })}
          />
          <NavItem
            icon={<Megaphone size={18} />}
            label="Broadcast Hub"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'broadcast' } })}
          />
          <NavItem
            icon={<Package size={18} />}
            label="Inventory Stock"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'inventory' } })}
          />
          <NavItem
            icon={<Tag size={18} />}
            label="Promotions & Deals"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'promotions' } })}
          />
          <NavItem
            icon={<Users size={18} />}
            label="Personnel Registry"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'clients' } })}
          />
          <NavItem
            icon={<ShieldAlert size={18} />}
            label="Security Audit"
            active={true}
          />
          <NavItem
            icon={<BarChart3 size={18} />}
            label="Financials"
            onClick={() => navigate('/admin-dashboard', { state: { targetTab: 'financials' } })}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="System Config"
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <motion.button
            whileHover={{ x: 5, color: '#ef4444' }}
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 transition-all text-[10px] font-bold uppercase tracking-widest group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto relative"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-white/[0.03] blur-[120px] rounded-full" />
        </div>

        <div className="relative p-8 md:p-12 space-y-8">
          {/* HEADER */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.30)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_28%)] pointer-events-none" />

            <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={14} className="text-[#D4AF37]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
                    Security Protocol
                  </p>
                </div>

                <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight text-white">
                  System <span className="text-transparent stroke-text">Audit Log</span>
                </h1>

                <p className="text-sm text-gray-400 mt-3 max-w-2xl">
                  Inspect protected system activity, operator actions, and registry events
                  from the secure audit archive.
                </p>
              </div>

              <button
                onClick={fetchLogs}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-3 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh Logs
              </button>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            <StatCard
              title="Total Actions Logged"
              value={`${logs.length}`}
              subtitle="EVENTS"
              icon={<Database className="text-[#D4AF37]" size={22} />}
              accent="default"
            />

            <StatCard
              title="Current Session"
              value={user?.name || 'Administrator'}
              subtitle="OPERATOR"
              icon={<User className="text-cyan-400" size={22} />}
              accent="gold"
            />

            <StatCard
              title="System Health"
              value="Encrypted"
              subtitle="SECURE"
              icon={<ShieldAlert className="text-emerald-400" size={22} />}
              accent="success"
            />

            <StatCard
              title="Archive Status"
              value={loading ? 'Syncing' : 'Online'}
              subtitle="REGISTRY"
              icon={<Clock className="text-amber-400" size={22} />}
              accent="default"
            />
          </motion.div>

          {/* TABLE */}
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20">
            
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                  <ShieldAlert className="text-[#D4AF37]" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Security Audit Registry</p>
                  <p className="text-xs text-gray-400">
                    {logs.length} recorded event{logs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

                            {/* 🔥 FILTER BAR (MOVE HERE) */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-4 px-6 py-4 border-b border-white/10 bg-black/20 items-center justify-between"
                  >
                  <div className="flex gap-4">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-xs uppercase tracking-widest text-gray-300 hover:border-[#D4AF37]/50 transition"
                  >
                    <option value="ALL">All Time</option>
                    <option value="THIS_MONTH">This Month</option>
                    <option value="LAST_MONTH">Last Month</option>
                    <option value="LAST_7_DAYS">Last 7 Days</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-xs uppercase tracking-widest text-gray-300 hover:border-[#D4AF37]/50 transition"
                  >
                    <option value="ALL">All Types</option>
                    <option value="STOCK">Inventory</option>
                    <option value="ORDER">Orders</option>
                    <option value="PROMOTION">Promotions</option>
                    <option value="USER">System</option>
                  </select>
                  </div>

                  <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generatePDF}
                  className="bg-[#D4AF37] text-black px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg"
                >
                  Download Report
                </motion.button>
                </motion.div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-white/[0.02]">
                  <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                    <th className="px-6 py-4 font-semibold">Protocol / Action</th>
                    <th className="px-6 py-4 font-semibold">Operator</th>
                    <th className="px-6 py-4 font-semibold">Execution Details</th>
                    <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-t border-white/6 hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                              <Activity className="text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-opacity" size={16} />
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white uppercase tracking-[0.12em]">
                                {log.action}
                              </span>
                              <span className="text-[11px] text-gray-500 uppercase tracking-[0.18em] mt-1">
                                Event #{String(log.id).padStart(4, '0')}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                            {log.performedBy || 'SYSTEM'}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-300 italic leading-relaxed max-w-[430px]">
                            "{log.details}"
                          </p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center mb-4">
                            <ShieldAlert className="text-gray-500" size={26} />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            No audit logs available
                          </h3>
                          <p className="text-sm text-gray-400 mt-2 max-w-md">
                            No events were returned from the secure audit registry.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.main>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4);
          color: transparent;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, accent = 'default' }) => {
  const accentStyles = {
    default: 'border-white/10 bg-white/[0.04]',
    gold: 'border-[#D4AF37]/15 bg-[#D4AF37]/6',
    success: 'border-emerald-500/15 bg-emerald-500/6'
  };

  return (
    <div
      className={`rounded-3xl border ${accentStyles[accent]} backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400 font-semibold">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl font-black text-white mt-2 break-words uppercase">
            {value}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <motion.button
    whileHover={{ x: 8 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
      active
        ? 'bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] font-black'
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-5 relative z-10 text-[11px] uppercase tracking-widest">
      <motion.span
        animate={active ? { rotate: [0, 10, -10, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {icon}
      </motion.span>
      {label}
    </div>

    {active && (
      <motion.div initial={{ x: -10 }} animate={{ x: 0 }}>
        <ChevronRight size={14} className="relative z-10" />
      </motion.div>
    )}

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