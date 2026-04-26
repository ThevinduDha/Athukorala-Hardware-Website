import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Activity,
  BarChart3,
  Bell,
  Search,
  ArrowUpRight,
  ShieldAlert,
  Tag,
  Megaphone,
  ChevronRight,
  Briefcase,
  Boxes,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
  Warehouse,
  Truck,
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Crown,
  Gift,
  RefreshCw,
  Database,
  Cpu,
  Brain,
  BarChart,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

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
import Financials from './Financials';
import SystemConfig from './SystemConfig';
import SupplierRegistry from './SupplierRegistry';
import OrderHistoryAdmin from './AdminOrders';

// Enhanced animations
const pageTransition = {
  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(8px)',
    transition: { duration: 0.3 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const staggerWrap = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Floating particles animation
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 4 + Math.random() * 8,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 40}%`],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

const AuditPreviewWidget = () => {
  const [recentLogs, setRecentLogs] = useState([]);
  const [hoveredLog, setHoveredLog] = useState(null);

  useEffect(() => {
    const fetchLogs = () => {
      fetch('http://localhost:8080/api/audit/logs')
        .then((res) => res.json())
        .then((data) => setRecentLogs(Array.isArray(data) ? data.slice(0, 5) : []))
        .catch(() => console.error('Audit Stream Offline'));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl" />

      <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <motion.p
            animate={{ letterSpacing: ['0.25em', '0.35em', '0.25em'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]"
          >
            System Integrity
          </motion.p>
          <h3 className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
            Live Audit Feed
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={16} className="text-[#D4AF37]" />
            </motion.div>
          </h3>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
          />
          <span className="text-[11px] font-semibold text-green-400">Live Stream</span>
        </motion.div>
      </div>

      <div className="space-y-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                whileHover={{ x: 8, backgroundColor: 'rgba(212,175,55,0.05)' }}
                onHoverStart={() => setHoveredLog(log.id)}
                onHoverEnd={() => setHoveredLog(null)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={hoveredLog === log.id ? { scale: [1, 1.3, 1] } : {}}
                      className="mt-2 w-2 h-2 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/50"
                    />
                    <div>
                      <p className="text-sm font-bold text-white">{log.action}</p>
                      <p className="text-xs text-gray-400 mt-1 break-words">
                        {log.performedBy} — {log.details}
                      </p>
                    </div>
                  </div>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-medium text-gray-500 whitespace-nowrap"
                  >
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </motion.span>
                </div>

                {hoveredLog === log.id && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent"
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Activity size={32} className="text-gray-600" />
              </motion.div>
              <p className="text-sm text-gray-500 mt-4">
                Monitoring encrypted streams...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Restock Plan Component
const RestockPlanSection = ({ restockData, onGenerate, onDownloadPDF, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 rounded-3xl blur-2xl" />
      
      {/* Main Card */}
      <div className="relative rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        {/* Animated Border Gradient */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              'linear-gradient(270deg, transparent, #D4AF37, transparent)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-px"
        />
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30"
              >
                <Brain size={28} className="text-black" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Restock Intelligence</h2>
                <p className="text-sm text-gray-400 mt-1">Machine learning predictions for optimal inventory levels</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGenerate}
                disabled={isLoading}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-2xl font-bold text-black">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                      <span>Analyzing Data...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={20} />
                      <span>Generate Restock Plan</span>
                      <Sparkles size={18} />
                    </>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDownloadPDF}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-white">
                  <span>Download PDF</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {restockData.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Database size={64} className="text-gray-700 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-400 text-lg">No restock plan generated yet</p>
              <p className="text-gray-500 text-sm mt-2">Click the button above to generate AI-powered recommendations</p>
            </motion.div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <RefreshCw size={48} className="text-[#D4AF37] mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-400">Processing inventory data...</p>
              <p className="text-gray-500 text-sm mt-2">Our AI is analyzing stock levels and sales patterns</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm">Total Products to Restock</p>
                  <p className="text-3xl font-bold text-white mt-1">{restockData.length}</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm">Total Units Needed</p>
                  <p className="text-3xl font-bold text-[#D4AF37] mt-1">
                    {restockData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm">Prediction Accuracy</p>
                  <p className="text-3xl font-bold text-green-500 mt-1">94.8%</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product ID</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Restock Status</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Qty</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restockData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ backgroundColor: 'rgba(212,175,55,0.05)' }}
                        className="border-b border-white/5 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center">
                              <Package size={14} className="text-[#D4AF37]" />
                            </div>
                            <span className="font-semibold text-white">{item.product_id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-medium">{item.product_name || `Product ${item.product_id}`}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                            <AlertCircle size={12} />
                            {item.restock === 1 ? "Urgent Restock" : "Monitor"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xl font-bold text-[#D4AF37]">{Math.round(item.quantity)}</span>
                          <span className="text-sm text-gray-500 ml-1">units</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${85 - index * 10}%` }}
                                transition={{ duration: 0.5, delay: index * 0.03 }}
                                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-400">High</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Brain size={14} className="text-[#D4AF37]" />
                  <span>Powered by Machine Learning Algorithm</span>
                </div>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={onGenerate}
                  className="text-xs text-[#D4AF37] hover:text-[#FFD700] transition-colors flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  Refresh Predictions
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('command');
  const [promoRefreshTrigger, setPromoRefreshTrigger] = useState(0);
  const [archiveRefresh, setArchiveRefresh] = useState(0);
  const [editingPromo, setEditingPromo] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [preSelectedProduct, setPreSelectedProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [restockData, setRestockData] = useState([]);
  const [isLoadingRestock, setIsLoadingRestock] = useState(false);

  useEffect(() => {
    if (location.state && location.state.targetTab) {
      setActiveTab(location.state.targetTab);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Administrator"}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleApplyDiscountFromAI = (product) => {
    setPreSelectedProduct(product);
    setActiveTab('promotions');
    toast.success(`⚡ DISCOUNT PROTOCOL: ${product.name}`, {
      icon: '🎯',
      style: {
        borderRadius: '14px',
        background: '#0a0a0a',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
        fontSize: '12px',
        fontWeight: '800'
      }
    });
  };

  // Fetch Restock Plan from ML endpoint
  const fetchRestockPlan = async () => {
    setIsLoadingRestock(true);
    try {
      const response = await fetch("http://localhost:8080/api/admin/ml/restock-plan");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Restock Plan Data:", data);
      // Filter only products that need restock (restock === 1)
      const filtered = data.filter(item => item.restock === 1);
      setRestockData(filtered);
      
      toast.success(`Restock plan generated! ${filtered.length} products need attention.`, {
        icon: '📊',
        style: {
          borderRadius: '14px',
          background: '#0a0a0a',
          color: '#D4AF37',
          border: '1px solid #D4AF37'
        }
      });
    } catch (error) {
      console.error("Error generating restock plan:", error);
      toast.error("Failed to generate restock plan. Please check your connection.", {
        icon: '❌',
        style: {
          borderRadius: '14px',
          background: '#0a0a0a',
          color: '#ef4444',
          border: '1px solid #ef4444'
        }
      });
    } finally {
      setIsLoadingRestock(false);
    }
  };

  // Download PDF Restock Plan
  const downloadRestockPDF = () => {
    window.open("http://localhost:8080/api/admin/ml/restock-pdf", "_blank");
    toast.success("Downloading Restock Plan PDF...", {
      icon: '📄',
      style: {
        borderRadius: '14px',
        background: '#0a0a0a',
        color: '#D4AF37',
        border: '1px solid #D4AF37'
      }
    });
  };

  const renderHeaderText = () => {
    const headers = {
      clients: { eyebrow: 'Personnel Management', title: 'Personnel Registry', sub: 'Manage people, roles, records, and staff operations.' },
      financials: { eyebrow: 'Financial Intelligence', title: 'Financial Overview', sub: 'Track business revenue, performance, and monetary activity.' },
      config: { eyebrow: 'System Configuration', title: 'System Control', sub: 'Adjust system settings and configuration controls.' },
      broadcast: { eyebrow: 'Broadcast Hub', title: 'Announcements Center', sub: 'Manage staff notices, promotions, and communication streams.' },
      promotions: { eyebrow: 'Promotions & Deals', title: 'Promotion Registry', sub: 'Create, update, and monitor customer-facing campaigns.' },
      inventory: { eyebrow: 'Inventory Stock', title: 'Inventory Management', sub: 'Track stock, stock flow, low-stock alerts, and warehouse availability.' },
      suppliers: { eyebrow: 'Supplier Network', title: 'Supplier Registry', sub: 'Manage suppliers, supplier records, and future product linking operations.' },
      orders: { eyebrow: 'Order Management', title: 'Order History', sub: 'View and manage all customer orders.' },
      command: { eyebrow: 'Executive Dashboard', title: `Welcome back, ${user.name}`, sub: 'Monitor operations, analytics, stock, and system activity.' }
    };
    return headers[activeTab] || headers.command;
  };

  const header = renderHeaderText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex overflow-hidden relative">
      <FloatingParticles />

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 288 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-screen sticky top-0 border-r border-white/10 bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-2xl z-40 flex flex-col shadow-2xl"
      >
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  boxShadow: [
                    '0 0 0px rgba(212,175,55,0)',
                    '0 0 30px rgba(212,175,55,0.6)',
                    '0 0 0px rgba(212,175,55,0)'
                  ]
                }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, boxShadow: { duration: 2, repeat: Infinity } }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center shrink-0 shadow-lg"
              >
                <Crown className="text-black" size={20} />
              </motion.div>

              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-base font-black tracking-tight text-white">Athukorala</p>
                  <p className="text-[10px] text-[#D4AF37] font-bold tracking-wider mt-0.5">INDUSTRIAL OS</p>
                </motion.div>
              )}
            </div>

            {!sidebarCollapsed && (
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(true)}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"
              >
                <PanelLeftClose size={16} />
              </motion.button>
            )}
          </div>

          {sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(false)}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"
              >
                <PanelLeftOpen size={16} />
              </motion.button>
            </motion.div>
          )}
        </div>

        <nav className="px-3 py-6 flex-1 overflow-y-auto space-y-1.5">
          {[
            { id: 'command', icon: <LayoutDashboard size={18} />, label: 'Command Center' },
            { id: 'broadcast', icon: <Megaphone size={18} />, label: 'Broadcast Hub' },
            { id: 'inventory', icon: <Package size={18} />, label: 'Inventory Stock' },
            { id: 'suppliers', icon: <Briefcase size={18} />, label: 'Supplier Registry' },
            { id: 'promotions', icon: <Tag size={18} />, label: 'Promotions & Deals' },
            { id: 'orders', icon: <Package size={18} />, label: 'Orders' },
            { id: 'clients', icon: <Users size={18} />, label: 'Personnel Registry' },
            { id: 'security', icon: <ShieldAlert size={18} />, label: 'Security Audit', isExternal: true },
            { id: 'financials', icon: <BarChart3 size={18} />, label: 'Financials' },
            { id: 'config', icon: <Settings size={18} />, label: 'System Config' }
          ].map((item, idx) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              collapsed={sidebarCollapsed}
              index={idx}
              onClick={() => item.isExternal ? navigate('/admin/audit-logs') : setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-all group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            {!sidebarCollapsed && <span className="text-sm font-bold">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

        <div className="px-6 lg:px-10 py-8 lg:py-10">
          {/* TOP HEADER */}
          {activeTab !== 'clients' && activeTab !== 'financials' && activeTab !== 'config' && activeTab !== 'promotions' && (
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 lg:mb-12"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/50"
                    />
                    <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-[0.22em]">
                      {header.eyebrow}
                    </p>
                  </div>

                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-none text-white">
                    {header.title.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="inline-block mr-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-base text-gray-400 max-w-2xl leading-relaxed"
                  >
                    {header.sub}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                >
                  <div className="relative group">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search registry..."
                      className="w-full sm:w-80 rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-gray-500 text-white"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-all group"
                  >
                    <Bell size={20} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    {notifications > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
                      >
                        <span className="text-[9px] font-bold text-white">{notifications}</span>
                      </motion.div>
                    )}
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <Clock size={14} className="text-[#D4AF37]" />
                    <span className="text-xs font-mono text-gray-400">
                      {currentTime.toLocaleTimeString()}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.header>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'command' && (
              <motion.div
                key="command"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <motion.div
                  variants={staggerWrap}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <StatCard
                    icon={<Boxes size={24} />}
                    label="Active Inventory"
                    value="14,208"
                    sub="Units currently in stock"
                    trend="+12.5%"
                    trendUp={true}
                  />
                  <StatCard
                    icon={<Wallet size={24} />}
                    label="Daily Revenue"
                    value="LKR 425K"
                    sub="Verified transactions today"
                    trend="+8.2%"
                    trendUp={true}
                  />
                  <StatCard
                    icon={<Users size={24} />}
                    label="Total Clients"
                    value="2,148"
                    sub="Registered database entries"
                    trend="+4.0%"
                    trendUp={true}
                  />
                </motion.div>

                {/* Restock Plan Section */}
                <RestockPlanSection 
                  restockData={restockData}
                  onGenerate={fetchRestockPlan}
                  onDownloadPDF={downloadRestockPDF}
                  isLoading={isLoadingRestock}
                />

                <motion.div
                  variants={staggerWrap}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <QuickAccessCard
                    icon={<Warehouse size={24} />}
                    title="Inventory Operations"
                    desc="Open stock dashboard, monitor product quantities, and continue stock control tasks."
                    actionLabel="Open Inventory"
                    onClick={() => setActiveTab('inventory')}
                  />
                  <QuickAccessCard
                    icon={<Truck size={24} />}
                    title="Supplier Operations"
                    desc="Access supplier registry, maintain supplier records, and manage procurement-side data."
                    actionLabel="Open Suppliers"
                    onClick={() => setActiveTab('suppliers')}
                  />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                >
                  <DiscountSuggestionPanel onApplyClick={handleApplyDiscountFromAI} />
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <AuditPreviewWidget />
                  </div>

                  <motion.div
                    variants={staggerWrap}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <motion.div variants={fadeUp}>
                      <LowStockWidget />
                    </motion.div>

                    <motion.div
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-10 -right-10 opacity-5"
                      >
                        <Zap size={120} />
                      </motion.div>

                      <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37] mb-3 flex items-center gap-2">
                          <Sparkles size={12} />
                          Quick Operations
                        </p>
                        <h3 className="text-2xl font-bold mb-6 text-white">Admin Shortcuts</h3>

                        <div className="space-y-3">
                          <ActionButton label="Add New Product" onClick={() => setIsModalOpen(true)} />
                          <ActionButton label="Open Inventory Panel" onClick={() => setActiveTab('inventory')} />
                          <ActionButton label="Open Supplier Registry" onClick={() => setActiveTab('suppliers')} />
                          <ActionButton label="Fiscal Analytics" onClick={() => setActiveTab('financials')} />
                          <ActionButton label="Stock Audit View" onClick={() => navigate('/admin/audit-logs')} />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'broadcast' && (
              <motion.div
                key="broadcast"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-10"
              >
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                    />
                    <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">
                      Internal Staff Protocol
                    </h2>
                  </div>
                  <StaffNoticeManager onSuccess={() => setArchiveRefresh((prev) => prev + 1)} />
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]/50"
                    />
                    <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                      Customer Promotion Engine
                    </h2>
                  </div>

                  <PromotionNoticeManager
                    editingNotice={editingNotice}
                    onCancelEdit={() => setEditingNotice(null)}
                    onSuccess={() => {
                      setEditingNotice(null);
                      setArchiveRefresh((prev) => prev + 1);
                    }}
                  />
                </motion.section>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <NoticeArchive
                    refreshTrigger={archiveRefresh}
                    onEdit={(notice) => {
                      setEditingNotice(notice);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'promotions' && (
              <motion.div
                key="promotions"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  <div className="xl:col-span-7">
                    <PromotionManager
                      preSelected={preSelectedProduct}
                      editingItem={editingPromo}
                      onCancelEdit={() => setEditingPromo(null)}
                      onSuccess={() => {
                        setPromoRefreshTrigger((prev) => prev + 1);
                        setPreSelectedProduct(null);
                        setEditingPromo(null);
                      }}
                    />
                  </div>

                  <div className="xl:col-span-5">
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37] mb-3 flex items-center gap-2">
                          <Gift size={12} />
                          Active Protocols
                        </p>
                        <h3 className="text-2xl font-bold mb-6 text-white">Running Promotions</h3>
                        <ActivePromotionList
                          refreshTrigger={promoRefreshTrigger}
                          onEdit={(promo) => setEditingPromo(promo)}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div
                key="config"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SystemConfig />
              </motion.div>
            )}

            {activeTab === 'financials' && (
              <motion.div
                key="financials"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Financials />
              </motion.div>
            )}

            {activeTab === 'suppliers' && (
              <motion.div
                key="suppliers"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SupplierRegistry />
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <InventoryList />
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div
                key="clients"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PersonnelRegistry />
              </motion.div>
            )}
            
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <OrderHistoryAdmin />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full sm:w-[540px] z-[70] shadow-2xl"
            >
              <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick, collapsed = false, index = 0 }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ x: collapsed ? 0 : 6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center ${
      collapsed ? 'justify-center' : 'justify-between'
    } rounded-2xl px-4 py-3.5 transition-all duration-300 group relative ${
      active
        ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-[0_10px_30px_rgba(212,175,55,0.3)]'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
    title={collapsed ? label : undefined}
  >
    <div className={`flex items-center ${collapsed ? '' : 'gap-3'} min-w-0`}>
      <motion.span
        animate={active ? { rotate: [0, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="shrink-0"
      >
        {icon}
      </motion.span>
      {!collapsed && (
        <span className="text-sm font-semibold truncate tracking-wide">
          {label}
        </span>
      )}
    </div>

    {!collapsed && active && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <ChevronRight size={16} />
      </motion.div>
    )}

    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute left-0 w-1 h-full bg-[#D4AF37] rounded-r-full"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
  </motion.button>
);

const StatCard = ({ icon, label, value, sub, trend, trendUp = true }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -8, borderColor: 'rgba(212,175,55,0.4)' }}
    className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group cursor-pointer"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute top-5 right-5"
    >
      {React.cloneElement(icon, { size: 54, className: "text-[#D4AF37]" })}
    </motion.div>

    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    
    <motion.h3
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="text-4xl lg:text-5xl font-black tracking-tight mt-4 text-white"
    >
      {value}
    </motion.h3>
    
    <p className="text-sm text-gray-500 mt-3">{sub}</p>

    <motion.div
      whileHover={{ x: 4 }}
      className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold ${
        trendUp 
          ? 'border-green-500/20 bg-green-500/10 text-green-400' 
          : 'border-red-500/20 bg-red-500/10 text-red-400'
      }`}
    >
      {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {trend}
    </motion.div>

    <motion.div
      whileHover={{ width: '100%' }}
      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent"
      style={{ width: '0%' }}
    />
  </motion.div>
);

const QuickAccessCard = ({ icon, title, desc, actionLabel, onClick }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -8, borderColor: 'rgba(212,175,55,0.35)' }}
    className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group"
  >
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-5"
    >
      {icon}
    </motion.div>

    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-sm text-gray-400 leading-relaxed">{desc}</p>

    <motion.button
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-transparent px-5 py-3 text-sm font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all group"
    >
      {actionLabel}
      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    </motion.button>
  </motion.div>
);

const ActionButton = ({ label, onClick }) => (
  <motion.button
    whileHover={{ x: 6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full rounded-2xl border border-white/10 bg-white/5 hover:border-[#D4AF37]/40 hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-transparent transition-all px-5 py-4 text-left flex items-center justify-between group"
  >
    <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
      {label}
    </span>
    <ArrowUpRight size={16} className="text-[#D4AF37] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </motion.button>
);

export default AdminDashboard;