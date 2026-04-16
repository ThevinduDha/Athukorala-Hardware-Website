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
  Truck
} from 'lucide-react';
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
import Financials from './Financials';
import SystemConfig from './SystemConfig';
import SupplierRegistry from './SupplierRegistry';
import OrderHistoryAdmin from './AdminOrders';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' }
  }
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const AuditPreviewWidget = () => {
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch('http://localhost:8080/api/audit/logs')
        .then((res) => res.json())
        .then((data) => setRecentLogs(Array.isArray(data) ? data.slice(0, 4) : []))
        .catch(() => console.error('Audit Stream Offline'));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)] relative overflow-hidden"
    >
      <motion.div
        animate={{ height: ['18%', '100%', '18%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-[2px] bg-[#D4AF37] opacity-50"
      />

      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            System Integrity
          </p>
          <h3 className="text-2xl font-bold text-white mt-2">Live Audit Feed</h3>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-semibold text-green-400">Live Data</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4 hover:border-[#D4AF37]/25 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <div>
                      <p className="text-sm font-semibold text-white">{log.action}</p>
                      <p className="text-xs text-gray-400 mt-1 break-words">
                        {log.performedBy} — {log.details}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic py-16 text-center">
              Monitoring encrypted streams...
            </p>
          )}
        </AnimatePresence>
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

  useEffect(() => {
    if (location.state && location.state.targetTab) {
      setActiveTab(location.state.targetTab);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Administrator"}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleApplyDiscountFromAI = (product) => {
    setPreSelectedProduct(product);
    setActiveTab('promotions');
    toast.success(`AUTHORIZING DISCOUNT FOR: ${product.name}`, {
      icon: '⚡',
      style: {
        borderRadius: '14px',
        background: '#050505',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
        fontSize: '12px',
        fontWeight: '800'
      }
    });
  };

  const renderHeaderText = () => {
    switch (activeTab) {
      case 'clients':
        return {
          eyebrow: 'Personnel Management',
          title: 'Personnel Registry',
          sub: 'Manage people, roles, records, and staff operations.'
        };
      case 'financials':
        return {
          eyebrow: 'Financial Intelligence',
          title: 'Financial Overview',
          sub: 'Track business revenue, performance, and monetary activity.'
        };
      case 'config':
        return {
          eyebrow: 'System Configuration',
          title: 'System Control',
          sub: 'Adjust system settings and configuration controls.'
        };
      case 'broadcast':
        return {
          eyebrow: 'Broadcast Hub',
          title: 'Announcements Center',
          sub: 'Manage staff notices, promotions, and communication streams.'
        };
      case 'promotions':
        return {
          eyebrow: 'Promotions & Deals',
          title: 'Promotion Registry',
          sub: 'Create, update, and monitor customer-facing campaigns.'
        };
      case 'inventory':
        return {
          eyebrow: 'Inventory Stock',
          title: 'Inventory Management',
          sub: 'Track stock, stock flow, low-stock alerts, and warehouse availability.'
        };
      case 'suppliers':
        return {
          eyebrow: 'Supplier Network',
          title: 'Supplier Registry',
          sub: 'Manage suppliers, supplier records, and future product linking operations.'
        };
      default:
        return {
          eyebrow: 'Senior Admin Protocol',
          title: `Welcome, ${user.name}`,
          sub: 'Monitor operations, analytics, stock, and system activity.'
        };
    }
  };

  const header = renderHeaderText();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 288 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="h-screen sticky top-0 border-r border-white/10 bg-black/45 backdrop-blur-2xl z-40 flex flex-col"
      >
        <div className="px-4 py-5 border-b border-white/6">
          <div className="flex items-center justify-between gap-3">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 8px rgba(212,175,55,0.10)',
                    '0 0 22px rgba(212,175,55,0.35)',
                    '0 0 8px rgba(212,175,55,0.10)'
                  ]
                }}
                transition={{ duration: 3.2, repeat: Infinity }}
                className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shrink-0"
              >
                <Activity className="text-black" size={22} />
              </motion.div>

              {!sidebarCollapsed && (
                <div>
                  <p className="text-base font-bold tracking-tight">Athukorala</p>
                  <p className="text-xs text-[#D4AF37] font-medium mt-0.5">Industrial OS</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300"
              >
                <PanelLeftClose size={16} />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300"
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          )}
        </div>

        <nav className="px-3 py-4 flex-1 overflow-y-auto space-y-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Command Center"
            active={activeTab === 'command'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('command')}
          />
          <NavItem
            icon={<Megaphone size={18} />}
            label="Broadcast Hub"
            active={activeTab === 'broadcast'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('broadcast')}
          />
          <NavItem
            icon={<Package size={18} />}
            label="Inventory Stock"
            active={activeTab === 'inventory'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('inventory')}
          />
          <NavItem
            icon={<Briefcase size={18} />}
            label="Supplier Registry"
            active={activeTab === 'suppliers'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('suppliers')}
          />
          <NavItem
            icon={<Tag size={18} />}
            label="Promotions & Deals"
            active={activeTab === 'promotions'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('promotions')}
          />

          <NavItem
            icon={<Package size={18} />}
            label="Orders"
            active={activeTab === 'orders'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('orders')}
          />
          <NavItem
            icon={<Users size={18} />}
            label="Personnel Registry"
            active={activeTab === 'clients'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('clients')}
          />
          <NavItem
            icon={<ShieldAlert size={18} />}
            label="Security Audit"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/admin/audit-logs')}
          />
          <NavItem
            icon={<BarChart3 size={18} />}
            label="Financials"
            active={activeTab === 'financials'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('financials')}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="System Config"
            active={activeTab === 'config'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('config')}
          />
        </nav>

        <div className="p-3 border-t border-white/6">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-red-300 bg-red-500/8 border border-red-500/15 hover:bg-red-500/12 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-sm font-semibold">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 overflow-y-auto relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-0 right-0 w-[760px] h-[760px] bg-[#D4AF37] blur-[170px] rounded-full -z-10"
        />

        <div className="px-6 lg:px-10 py-8 lg:py-10">
          {/* TOP HEADER */}
          {activeTab !== 'clients' &&
            activeTab !== 'financials' &&
            activeTab !== 'config' &&
            activeTab !== 'promotions' && (
              <header className="mb-10 lg:mb-12">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      <p className="text-sm font-semibold text-[#D4AF37] uppercase tracking-[0.22em]">
                        {header.eyebrow}
                      </p>
                    </div>

                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-none">
                      {header.title}
                    </h1>

                    <p className="mt-4 text-base text-gray-400 max-w-2xl leading-relaxed">
                      {header.sub}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                  >
                    <div className="relative group">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37]"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search registry..."
                        className="w-full sm:w-72 rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-500"
                      />
                    </div>

                    <motion.button
                      whileHover={{ rotate: 10 }}
                      className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center relative hover:bg-[#D4AF37]/15 transition-all"
                    >
                      <Bell size={20} className="text-[#D4AF37]" />
                      <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 border-2 border-[#050505] rounded-full" />
                    </motion.button>
                  </motion.div>
                </div>
              </header>
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
                    icon={<Boxes />}
                    label="Active Inventory"
                    value="14,208"
                    sub="Units currently in stock"
                    trend="+12.5%"
                  />
                  <StatCard
                    icon={<Wallet />}
                    label="Daily Revenue"
                    value="LKR 425K"
                    sub="Verified transactions today"
                    trend="+8.2%"
                  />
                  <StatCard
                    icon={<Users />}
                    label="Total Clients"
                    value="2,148"
                    sub="Registered database entries"
                    trend="+4.0%"
                  />
                </motion.div>

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

                <motion.div variants={fadeUp} initial="hidden" animate="show">
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
                      className="rounded-3xl border border-white/10 bg-[#D4AF37]/6 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.28)] relative overflow-hidden"
                    >
                      <div className="absolute top-5 right-5 opacity-10">
                        <Activity size={72} />
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
                        Quick Operations
                      </p>
                      <h3 className="text-2xl font-bold mb-6">Admin Shortcuts</h3>

                      <div className="space-y-4">
                        <ActionButton label="Add New Product" onClick={() => setIsModalOpen(true)} />
                        <ActionButton label="Open Inventory Panel" onClick={() => setActiveTab('inventory')} />
                        <ActionButton label="Open Supplier Registry" onClick={() => setActiveTab('suppliers')} />
                        <ActionButton label="Fiscal Analytics" onClick={() => setActiveTab('financials')} />
                        <ActionButton
                          label="Stock Audit View"
                          onClick={() => navigate('/admin/audit-logs')}
                        />
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
                <section className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-400">
                      Internal Staff Protocol
                    </h2>
                  </div>
                  <StaffNoticeManager onSuccess={() => setArchiveRefresh((prev) => prev + 1)} />
                </section>

                <section className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
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
                </section>

                <motion.div variants={fadeUp} initial="hidden" animate="show">
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

                  <div className="xl:col-span-5 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37] mb-3">
                      Active Protocols
                    </p>
                    <h3 className="text-2xl font-bold mb-6">Running Promotions</h3>
                    <ActivePromotionList
                      refreshTrigger={promoRefreshTrigger}
                      onEdit={(promo) => setEditingPromo(promo)}
                    />
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 190 }}
              className="fixed right-0 top-0 h-screen w-full sm:w-[520px] z-[70] shadow-2xl"
            >
              <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick, collapsed = false }) => (
  <motion.button
    whileHover={{ x: collapsed ? 0 : 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center ${
      collapsed ? 'justify-center' : 'justify-between'
    } rounded-2xl px-4 py-3.5 transition-all duration-300 group relative ${
      active
        ? 'bg-[#D4AF37] text-black shadow-[0_10px_24px_rgba(212,175,55,0.18)]'
        : 'text-gray-400 hover:text-white hover:bg-white/6'
    }`}
    title={collapsed ? label : undefined}
  >
    <div className={`flex items-center ${collapsed ? '' : 'gap-3'} min-w-0`}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <span className="text-sm font-medium truncate">
          {label}
        </span>
      )}
    </div>

    {!collapsed && active && <ChevronRight size={16} />}
  </motion.button>
);

const StatCard = ({ icon, label, value, sub, trend }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, borderColor: 'rgba(212,175,55,0.35)' }}
    className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.24)] relative overflow-hidden"
  >
    <div className="absolute top-5 right-5 text-[#D4AF37]/12">
      {React.cloneElement(icon, { size: 54 })}
    </div>

    <p className="text-sm font-semibold text-gray-400">{label}</p>
    <h3 className="text-4xl lg:text-5xl font-black tracking-tight mt-4 text-white">
      {value}
    </h3>
    <p className="text-sm text-gray-500 mt-3">{sub}</p>

    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/8 px-3.5 py-2 text-sm font-semibold text-[#D4AF37]">
      <ArrowUpRight size={14} />
      {trend}
    </div>
  </motion.div>
);

const QuickAccessCard = ({ icon, title, desc, actionLabel, onClick }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, borderColor: 'rgba(212,175,55,0.28)' }}
    className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
  >
    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/12 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-5">
      {icon}
    </div>

    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-sm text-gray-400 leading-relaxed">{desc}</p>

    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all"
    >
      {actionLabel}
      <ArrowUpRight size={16} />
    </motion.button>
  </motion.div>
);

const ActionButton = ({ label, onClick }) => (
  <motion.button
    whileHover={{ x: 4, scale: 1.01 }}
    whileTap={{ scale: 0.985 }}
    onClick={onClick}
    className="w-full rounded-2xl border border-white/10 bg-white/4 hover:border-[#D4AF37]/35 hover:bg-white/6 transition-all px-5 py-4 text-left flex items-center justify-between"
  >
    <span className="text-sm font-semibold text-white">{label}</span>
    <ArrowUpRight size={16} className="text-[#D4AF37]" />
  </motion.button>
);

export default AdminDashboard;