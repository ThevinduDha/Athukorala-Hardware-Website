import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  LogOut,
  Activity,
  Clock3,
  MapPin,
  LayoutGrid,
  Heart,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  BadgeCheck,
  Search,
  CalendarDays,
  ArrowUpRight,
  CheckCircle2,
  TimerReset,
  Truck,
  ShieldCheck,
  Boxes
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Authorized Guest"}');

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Invalid date'
      : date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
  };

  const getStatusConfig = (status) => {
    const normalized = (status || '').toUpperCase();

    if (normalized === 'COMPLETED' || normalized === 'DELIVERED') {
      return {
        label: status || 'Completed',
        icon: <CheckCircle2 size={14} />,
        className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
      };
    }

    if (normalized === 'SHIPPED' || normalized === 'DISPATCHED') {
      return {
        label: status || 'Shipped',
        icon: <Truck size={14} />,
        className: 'border-sky-500/20 bg-sky-500/10 text-sky-300'
      };
    }

    if (normalized === 'PENDING' || normalized === 'PROCESSING') {
      return {
        label: status || 'Processing',
        icon: <TimerReset size={14} />,
        className: 'border-amber-500/20 bg-amber-500/10 text-amber-300'
      };
    }

    return {
      label: status || 'Authorized',
      icon: <Clock3 size={14} />,
      className: 'border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]'
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          toast.error('Failed to retrieve order history');
        }
      } catch (err) {
        toast.error('Failed to retrieve transaction archives');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user.id]);

  const filteredOrders = useMemo(() => {
    let result = Array.isArray(orders) ? orders : [];

    if (statusFilter !== 'ALL') {
      result = result.filter(
        (order) => (order?.status || '').toUpperCase() === statusFilter
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const idText = `ATH-${order?.id || ''}`.toLowerCase();
        const addressText = (order?.shippingAddress || '').toLowerCase();
        const amountText = String(order?.totalAmount || '').toLowerCase();
        return (
          idText.includes(term) ||
          addressText.includes(term) ||
          amountText.includes(term)
        );
      });
    }

    return result;
  }, [orders, searchTerm, statusFilter]);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) =>
    ['COMPLETED', 'DELIVERED'].includes((o?.status || '').toUpperCase())
  ).length;
  const pendingOrders = orders.filter((o) =>
    ['PENDING', 'PROCESSING'].includes((o?.status || '').toUpperCase())
  ).length;
  const totalSpent = orders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 300 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden xl:flex h-screen sticky top-0 border-r border-white/10 bg-black/60 backdrop-blur-2xl flex-col z-40"
      >
        <div className="px-5 py-5 border-b border-white/8">
          <div className={`flex items-center justify-between gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.22)]">
                <Activity className="text-black" size={22} />
              </div>

              {!sidebarCollapsed && (
                <div>
                  <p className="text-[18px] font-semibold tracking-tight text-white">
                    Athukorala
                  </p>
                  <p className="text-sm text-[#D4AF37] mt-0.5">
                    Client Registry
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-all"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
        </div>

        <nav className="px-4 py-5 space-y-3 flex-1 overflow-y-auto">
          <SideNavItem
            icon={<LayoutGrid size={18} />}
            label="Market Registry"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/customer-dashboard')}
          />
          <SideNavItem
            icon={<Package size={18} />}
            label="Order History"
            active
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/order-history')}
          />
          <SideNavItem
            icon={<Heart size={18} />}
            label="Curated List"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/curated-list')}
          />
          <SideNavItem
            icon={<User size={18} />}
            label="Account Config"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/profile')}
          />
        </nav>

        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center shrink-0">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user?.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-[#D4AF37]">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.14em]">
                    Authenticated Identity
                  </p>
                  <p className="text-lg font-medium text-[#D4AF37] mt-1 truncate">
                    {user?.name || 'Authorized Guest'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <BadgeCheck className="text-[#D4AF37]" size={18} />
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="rounded-[28px] border border-[#D4AF37]/12 bg-[#D4AF37]/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#D4AF37] mb-3">
                Order Intelligence
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Review your previous purchases, track order states, and monitor your spending.
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full rounded-2xl px-4 py-3.5 border border-red-500/20 bg-red-500/8 text-red-300 hover:bg-red-500/12 flex items-center gap-3 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[760px] h-[760px] bg-[#D4AF37]/5 blur-[180px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />

        <div className="px-5 sm:px-8 lg:px-10 2xl:px-14 py-8 lg:py-10">
          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8"
          >
            <div>
              <p className="text-sm text-gray-400">Customer Portal</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Order History
              </h2>
            </div>

            <TopUserChip user={user} />
          </motion.div>

          {/* MOBILE TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:hidden mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_22px_rgba(212,175,55,0.22)]">
                <Package className="text-black" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Customer Portal</p>
                <h2 className="text-lg font-semibold">Order History</h2>
              </div>
            </div>

            <button
              onClick={() => navigate('/customer-dashboard')}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-all"
            >
              Dashboard
            </button>
          </motion.div>

          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-2xl p-6 sm:p-8 lg:p-10 overflow-hidden relative">
              <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#D4AF37]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#D4AF37] mb-5">
                    <ShieldCheck size={14} />
                    Secure Order Archive
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight leading-tight">
                    Review every
                    <span className="block text-[#D4AF37]">purchase with clarity</span>
                  </h1>

                  <p className="text-sm sm:text-base text-gray-400 max-w-2xl mt-5 leading-relaxed">
                    Track completed transactions, monitor pending deliveries, and access your full
                    customer purchase history from one refined interface.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full xl:w-auto xl:min-w-[380px]">
                  <MetricCard
                    icon={<Boxes size={18} />}
                    label="Total Orders"
                    value={totalOrders}
                  />
                  <MetricCard
                    icon={<CheckCircle2 size={18} />}
                    label="Completed"
                    value={completedOrders}
                  />
                  <MetricCard
                    icon={<TimerReset size={18} />}
                    label="Pending"
                    value={pendingOrders}
                  />
                  <MetricCard
                    icon={<ArrowUpRight size={18} />}
                    label="Total Spent"
                    value={`LKR ${totalSpent.toLocaleString()}`}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* FILTER BAR */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Search by order ID, amount, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-white/10 bg-[#050505]/70 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#D4AF37]/40 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'DELIVERED'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 h-12 rounded-2xl text-sm border transition-all ${
                          statusFilter === status
                            ? 'border-[#D4AF37]/30 bg-[#D4AF37] text-black font-semibold'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ORDERS */}
          {loading ? (
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] min-h-[320px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-[#D4AF37]">
                <Activity className="animate-spin" size={34} />
                <p className="text-sm text-gray-400">Loading transaction archives...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Package className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No orders found</h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                There are no order records matching your current search or filter settings.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 2xl:grid-cols-2 gap-6"
            >
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  getStatusConfig={getStatusConfig}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

const getInitials = (name) => {
  const parts = (name || 'User').trim().split(' ');
  const first = parts[0]?.charAt(0) || '';
  const second = parts[1]?.charAt(0) || '';
  return `${first}${second}`.toUpperCase() || 'U';
};

const TopUserChip = ({ user }) => {
  return (
    <div className="flex items-center gap-4 self-start lg:self-auto rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center shrink-0">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user?.name || 'Profile'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-[#D4AF37]">
            {getInitials(user?.name)}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
          Logged in as
        </p>
        <p className="text-sm font-medium text-white">
          {user?.name || 'Authorized Guest'}
        </p>
      </div>
    </div>
  );
};

const SideNavItem = ({ icon, label, active = false, collapsed = false, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all border ${
        active
          ? 'border-[#D4AF37]/25 bg-[#D4AF37] text-black shadow-[0_12px_35px_rgba(212,175,55,0.18)]'
          : 'border-transparent bg-transparent text-gray-300 hover:bg-white/[0.05] hover:border-white/8'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={active ? 'text-black' : 'text-[#D4AF37]'}>{icon}</span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </motion.button>
  );
};

const MetricCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 backdrop-blur-xl p-4">
      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] mb-3">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <p className="text-lg sm:text-xl font-semibold mt-2 break-words">{value}</p>
    </div>
  );
};

const OrderCard = ({ order, formatDate, getStatusConfig }) => {
  const status = getStatusConfig(order?.status);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4 }}
      className="group rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-transparent backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">
            Registry Order ID
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            ATH-{order?.id}
          </h3>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 border text-xs font-semibold uppercase tracking-[0.12em] w-fit ${status.className}`}
        >
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoTile
          icon={<CalendarDays size={17} />}
          label="Order Date"
          value={formatDate(order?.orderDate)}
        />
        <InfoTile
          icon={<ArrowUpRight size={17} />}
          label="Net Valuation"
          value={`LKR ${(order?.totalAmount || 0).toLocaleString()}`}
          valueClassName="text-[#D4AF37]"
        />
        <InfoTile
          icon={<MapPin size={17} />}
          label="Shipping Address"
          value={order?.shippingAddress || 'Standard delivery protocol'}
        />
        <InfoTile
          icon={<ShieldCheck size={17} />}
          label="Order Security"
          value="Verified transaction registry"
        />
      </div>
    </motion.div>
  );
};

const InfoTile = ({ icon, label, value, valueClassName = 'text-white' }) => {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.12em] mb-3">
        <span className="text-[#D4AF37]">{icon}</span>
        {label}
      </div>
      <p className={`text-sm sm:text-base leading-relaxed break-words ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
};

export default OrderHistory;