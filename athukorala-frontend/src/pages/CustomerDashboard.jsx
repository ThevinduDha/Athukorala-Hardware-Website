import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Eye,
  Package,
  Heart,
  User,
  Activity,
  LogOut,
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Sparkles,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  BadgeCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Boxes,
  ArrowUpRight,
  SlidersHorizontal,
  ListFilter,
  TrendingUp,
  Zap,
  Gift,
  Star,
  Clock,
  Award,
  Flame,
  Diamond,
  Truck,
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
  Filter,
  Grid3x3,
  Grid3x3Icon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Range, getTrackBackground } from "react-range";
import CustomerAnnouncement from '../components/CustomerAnnouncement';
import ThemeToggle from '../components/ThemeToggle';

const CATEGORY_OPTIONS = [
  'ALL',
  'ELECTRICAL',
  'PLUMBING',
  'PAINTING & ADHESIVES',
  'POWER TOOLS',
  'HAND TOOLS',
  'BUILDING MATERIALS',
  'FASTENERS & SCREWS',
  'SAFETY GEAR'
];

const SORT_OPTIONS = [
  { value: 'LATEST', label: 'Latest Added' },
  { value: 'PRICE_LOW_HIGH', label: 'Price: Low to High' },
  { value: 'PRICE_HIGH_LOW', label: 'Price: High to Low' },
  { value: 'NAME_A_Z', label: 'Name: A to Z' }
];

// Animation variants
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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardHover = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 4 + Math.random() * 12,
    delay: Math.random() * 5,
    size: 1 + Math.random() * 3
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/10"
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 30}%`, `${particle.y}%`],
            x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
            opacity: [0, 0.4, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
          style={{ width: particle.size, height: particle.size }}
        />
      ))}
    </div>
  );
};

// Animated background gradient
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden -z-20">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        rotate: [360, 270, 180, 90, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
    />
  </div>
);

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProductsState, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [curatedIds, setCuratedIds] = useState([]);
  const [filterMode, setFilterMode] = useState('all');
  const [sortType, setSortType] = useState('LATEST');
  const [values, setValues] = useState([0, 100000]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Authorized Guest"}');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldBeDark = savedTheme === "dark" || savedTheme === null;
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      if (savedTheme === null) localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    if (user.id) {
      fetchCart();
      fetchCuratedRegistry();
      loadRecentlyViewed();
    }
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/products/all')
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setProducts(safeData);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Hardware Registry Offline');
        setIsLoading(false);
      });
  };

  const fetchCart = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Cart Sync Failure');
    }
  };

  const fetchCuratedRegistry = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/curated/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCuratedIds(Array.isArray(data) ? data.map((item) => item.product.id) : []);
      }
    } catch (err) {
      console.error('Curated Registry Sync Failure');
    }
  };

  const loadRecentlyViewed = () => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored).slice(0, 4));
    }
  };

  const saveRecentlyViewed = (product) => {
    const stored = localStorage.getItem('recentlyViewed');
    let recent = stored ? JSON.parse(stored) : [];
    recent = [product, ...recent.filter(p => p.id !== product.id)].slice(0, 6);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    setRecentlyViewed(recent);
  };

  useEffect(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (category !== 'ALL') {
      result = result.filter(
        (p) => (p.category || '').toUpperCase() === category.toUpperCase()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() || '';
        const cat = p.category?.toLowerCase() || '';
        const description = p.description?.toLowerCase() || '';
        return (
          name.includes(term) ||
          cat.includes(term) ||
          description.includes(term)
        );
      });
    }

    result = result.filter((p) => {
      const price =
        p.discountedPrice && p.discountedPrice < p.price
          ? p.discountedPrice
          : p.price || 0;
      return price >= values[0] && price <= values[1];
    });

    if (filterMode === 'offers') {
      result = result.filter((p) => p.discountedPrice && p.discountedPrice < p.price);
    }

    if (sortType === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => {
        const priceA = a.discountedPrice && a.discountedPrice < a.price ? a.discountedPrice : a.price || 0;
        const priceB = b.discountedPrice && b.discountedPrice < b.price ? b.discountedPrice : b.price || 0;
        return priceA - priceB;
      });
    } else if (sortType === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => {
        const priceA = a.discountedPrice && a.discountedPrice < a.price ? a.discountedPrice : a.price || 0;
        const priceB = b.discountedPrice && b.discountedPrice < b.price ? b.discountedPrice : b.price || 0;
        return priceB - priceA;
      });
    } else if (sortType === 'NAME_A_Z') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }

    setFilteredProducts(result);
  }, [products, category, searchTerm, filterMode, sortType, values]);

  const handleAddToCart = async (product) => {
    if (user.name.includes('Guest')) {
      toast.error('Authentication Required');
      return false;
    }

    if (product.stockQuantity <= 0) {
      toast.error('Asset Depleted');
      return false;
    }

    const loading = toast.loading('Syncing Cart Registry...');
    try {
      const res = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 })
      });

      if (res.ok) {
        toast.success(`${product.name} Registered`, { id: loading });
        await fetchCart();
        return true;
      }

      toast.error('Registry Handshake Failed', { id: loading });
      return false;
    } catch (err) {
      toast.error('Connection Failed', { id: loading });
      return false;
    }
  };

  const updateCartQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/update-quantity/${itemId}?quantity=${newQty}`,
        { method: 'PATCH' }
      );
      if (res.ok) fetchCart();
    } catch (err) {
      toast.error('Update Failed');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Removed from registry');
        fetchCart();
      }
    } catch (err) {
      toast.error('Removal Failed');
    }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      const price = item?.product?.discountedPrice || item?.product?.price || 0;
      return acc + price * (item?.quantity || 0);
    }, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const triggerSecureOffer = () => {
    setFilterMode('offers');
    const section = document.getElementById('market-registry-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });

    toast.success('Promotional assets filtered', {
      icon: '🔥',
      style: {
        borderRadius: '14px',
        background: '#050505',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
        fontSize: '12px',
        fontWeight: '700'
      }
    });
  };

  const handleProductClick = (product) => {
    saveRecentlyViewed(product);
    navigate(`/product/${product.id}`);
  };

  const getInitials = (name) => {
    const parts = (name || 'User').trim().split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`.toUpperCase() || 'U';
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white font-sans overflow-hidden selection:bg-[#D4AF37] selection:text-black relative">
      <FloatingParticles />
      <AnimatedBackground />

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 300 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden xl:flex h-screen sticky top-0 border-r border-white/10 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-2xl flex-col z-40 relative"
      >
        <div className="px-5 py-5 border-b border-white/8">
          <div className={`flex items-center justify-between gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  boxShadow: [
                    '0 0 0px rgba(212,175,55,0)',
                    '0 0 25px rgba(212,175,55,0.4)',
                    '0 0 0px rgba(212,175,55,0)'
                  ]
                }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, boxShadow: { duration: 2, repeat: Infinity } }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8960F] flex items-center justify-center shadow-lg"
              >
                <Diamond className="text-black" size={22} />
              </motion.div>

              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-[18px] font-bold tracking-tight text-white">
                    Athukorala
                  </p>
                  <p className="text-xs text-[#D4AF37] font-bold tracking-wider mt-0.5">
                    Client Registry
                  </p>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-all"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </motion.button>
          </div>
        </div>

        <nav className="px-4 py-5 space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'market', icon: <LayoutGrid size={18} />, label: 'Market Registry', path: '/customer-dashboard' },
            { id: 'orders', icon: <Package size={18} />, label: 'Order History', path: '/order-history' },
            { id: 'curated', icon: <Heart size={18} />, label: 'Curated List', path: '/curated-list' },
            { id: 'profile', icon: <User size={18} />, label: 'Account Config', path: '/profile' }
          ].map((item, idx) => (
            <SideNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={window.location.pathname === item.path}
              collapsed={sidebarCollapsed}
              index={idx}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="px-4 pb-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-5 relative overflow-hidden group"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent"
            />
            {!sidebarCollapsed ? (
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center shrink-0"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user?.name || 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#D4AF37]">
                        {getInitials(user?.name)}
                      </span>
                    )}
                  </motion.div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.14em]">
                      Authenticated Identity
                    </p>
                    <p className="text-base font-bold text-[#D4AF37] mt-1 truncate">
                      {user?.name || 'Authorized Guest'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center relative z-10">
                <BadgeCheck className="text-[#D4AF37]" size={18} />
              </div>
            )}
          </motion.div>

          <ThemeToggle />

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-[28px] border border-[#D4AF37]/12 bg-[#D4AF37]/[0.04] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={12} className="text-green-500" />
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] font-bold">
                  Verified Session
                </p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Secure customer portal with refined purchasing and curated inventory access.
              </p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ x: sidebarCollapsed ? 0 : 4, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full rounded-2xl px-4 py-3.5 border border-red-500/20 bg-red-500/8 text-red-300 hover:bg-red-500/12 flex items-center gap-3 transition-all group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="px-5 sm:px-8 lg:px-10 2xl:px-14 py-8 lg:py-10">
          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8"
          >
            <div>
              <motion.p
                animate={{ letterSpacing: ['0.15em', '0.25em', '0.15em'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em]"
              >
                Customer Portal
              </motion.p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1 flex items-center gap-2">
                Dashboard
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={20} className="text-[#D4AF37]" />
                </motion.div>
              </h2>
            </div>

            <TopUserChip user={user} currentTime={currentTime} />
          </motion.div>

          {/* HERO ANNOUNCEMENT */}
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-2xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] relative overflow-hidden group">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"
              />
              <CustomerAnnouncement onSecureOffer={triggerSecureOffer} />
            </div>
          </motion.section>

          {/* STATS SECTION */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={staggerWrap}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
          >
            <LuxuryStatCard
              icon={<Boxes size={20} />}
              label="Active Products"
              value={products.length.toLocaleString()}
              sub="Verified items in registry"
              gradient="from-blue-500/10 to-blue-600/5"
            />
            <LuxuryStatCard
              icon={<ShoppingCart size={20} />}
              label="Cart Assets"
              value={cartItems.length.toLocaleString()}
              sub="Ready for checkout"
              gradient="from-green-500/10 to-green-600/5"
            />
            <LuxuryStatCard
              icon={<Flame size={20} />}
              label="Promotional Items"
              value={
                products.filter((p) => p.discountedPrice && p.discountedPrice < p.price).length.toLocaleString()
              }
              sub="Discounted inventory"
              gradient="from-orange-500/10 to-red-600/5"
            />
          </motion.section>

          {/* RECENTLY VIEWED */}
          {recentlyViewed.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#D4AF37]" />
                  <h3 className="text-lg font-bold text-white">Recently Viewed</h3>
                </div>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => setRecentlyViewed([])}
                  className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
                >
                  Clear History
                </motion.button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recentlyViewed.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-[#D4AF37]/30 transition-all group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-20 object-contain mb-2 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-xs text-gray-400 truncate">{product.name}</p>
                    <p className="text-[11px] text-[#D4AF37] font-bold mt-1">
                      LKR {(product.discountedPrice || product.price || 0).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* HEADER WITH FILTERS */}
          <header
            id="market-registry-section"
            className="flex flex-col 2xl:flex-row justify-between items-start gap-10 mb-14"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#D4AF37]"
                />
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                  Secure Customer Session
                </p>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[0.92]">
                Premium Industrial
                <span className="text-[#D4AF37] block mt-2">Assets</span>
              </h1>

              <p className="text-base text-gray-400 mt-5 max-w-2xl leading-relaxed">
                Explore a refined hardware registry with curated tools, verified pricing,
                and secure purchase flow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full 2xl:w-auto flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative group flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search registry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-5 text-sm outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-500"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex border border-white/10 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 px-4 transition-all ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Grid3x3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 px-4 transition-all ${viewMode === 'list' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                      <ListFilter size={16} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(true)}
                    className="relative h-[56px] w-[56px] rounded-2xl bg-[#D4AF37]/8 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center shrink-0 group"
                  >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    <AnimatePresence>
                      {cartItems.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black text-[11px] font-bold flex items-center justify-center rounded-full shadow-lg"
                        >
                          {cartItems.length}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`h-[56px] w-[56px] rounded-2xl border transition-all flex items-center justify-center ${
                      isFilterVisible ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Filter size={18} />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {isFilterVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4">
                      <div className="mb-4 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                        <h3 className="text-[#D4AF37] font-bold mb-3 flex items-center gap-2 text-sm">
                          <SlidersHorizontal size={14} /> Filter by Price
                        </h3>
                        <div className="flex justify-between text-xs mb-3">
                          <span className="text-gray-300">LKR {values[0].toLocaleString()}</span>
                          <span className="text-gray-300">LKR {values[1].toLocaleString()}</span>
                        </div>
                        <Range
                          values={values}
                          step={100}
                          min={0}
                          max={100000}
                          onChange={(vals) => setValues(vals)}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              className="h-2 w-full rounded"
                              style={{
                                background: getTrackBackground({
                                  values,
                                  colors: ["#444", "#D4AF37", "#444"],
                                  min: 0,
                                  max: 100000
                                })
                              }}
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              className="h-5 w-5 bg-[#D4AF37] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                            />
                          )}
                        />
                      </div>

                      <div className="relative">
                        <ListFilter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" />
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setFilterMode('all');
                          }}
                          className="w-full h-12 rounded-xl border border-white/10 bg-[#050505] pl-10 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/40 transition-all appearance-none cursor-pointer"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat === 'ALL' ? 'ALL CATEGORIES' : cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" />
                        <select
                          value={sortType}
                          onChange={(e) => setSortType(e.target.value)}
                          className="w-full h-12 rounded-xl border border-white/10 bg-[#050505] pl-10 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/40 transition-all appearance-none cursor-pointer"
                        >
                          {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setFilterMode((prev) => (prev === 'offers' ? 'all' : 'offers'));
                        }}
                        className={`h-12 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                          filterMode === 'offers'
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                            : 'border-white/10 text-gray-300 hover:border-[#D4AF37]/30 hover:text-white bg-white/[0.03]'
                        }`}
                      >
                        <Gift size={14} />
                        {filterMode === 'offers' ? 'Clear Offer Filter' : 'Show Offers Only'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <QuickFilterChip
                        active={category === 'ALL' && filterMode === 'all'}
                        onClick={() => {
                          setCategory('ALL');
                          setFilterMode('all');
                        }}
                        label="All Products"
                      />
                      <QuickFilterChip
                        active={filterMode === 'offers'}
                        onClick={() => setFilterMode('offers')}
                        label="🔥 Promotions"
                      />
                      <QuickFilterChip
                        active={category === 'POWER TOOLS' && filterMode === 'all'}
                        onClick={() => {
                          setCategory('POWER TOOLS');
                          setFilterMode('all');
                        }}
                        label="⚡ Power Tools"
                      />
                      <QuickFilterChip
                        active={category === 'SAFETY GEAR' && filterMode === 'all'}
                        onClick={() => {
                          setCategory('SAFETY GEAR');
                          setFilterMode('all');
                        }}
                        label="🛡️ Safety Gear"
                      />
                      <QuickFilterChip
                        active={category === 'ELECTRICAL' && filterMode === 'all'}
                        onClick={() => {
                          setCategory('ELECTRICAL');
                          setFilterMode('all');
                        }}
                        label="⚡ Electrical"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </header>

          {/* PRODUCT GRID */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden"
                >
                  <div className="aspect-[4/4.8] bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-800 rounded animate-pulse w-full mt-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredProductsState.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5"
              >
                <Package className="text-[#D4AF37]" size={28} />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3">No products found</h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                No products match your current category, search, or sorting filters.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCategory('ALL');
                  setSearchTerm('');
                  setFilterMode('all');
                  setValues([0, 100000]);
                  setSortType('LATEST');
                }}
                className="mt-6 px-6 py-3 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Reset Filters
              </motion.button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.section
              initial="hidden"
              animate="show"
              variants={staggerWrap}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7"
            >
              {filteredProductsState.map((product, idx) => (
                <LuxuryProductCard
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onAddToCart={() => handleAddToCart(product)}
                  onProductClick={() => handleProductClick(product)}
                  isInitiallyCurated={curatedIds.includes(product.id)}
                  index={idx}
                />
              ))}
            </motion.section>
          ) : (
            <motion.section
              initial="hidden"
              animate="show"
              variants={staggerWrap}
              className="space-y-4"
            >
              {filteredProductsState.map((product, idx) => (
                <ProductListView
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onAddToCart={() => handleAddToCart(product)}
                  onProductClick={() => handleProductClick(product)}
                  isInitiallyCurated={curatedIds.includes(product.id)}
                  index={idx}
                />
              ))}
            </motion.section>
          )}
        </div>
      </main>

      {/* CART SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/86 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-gradient-to-b from-[#080808] to-black border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 lg:p-8 border-b border-white/8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ShoppingCart size={22} className="text-[#D4AF37]" />
                    Cart Registry
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Secure purchase preparation</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-gray-600 py-20"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ShoppingCart size={100} strokeWidth={1} className="text-gray-700" />
                    </motion.div>
                    <p className="font-medium mt-6 text-lg text-gray-400">Empty Registry</p>
                    <p className="text-sm text-gray-500 mt-1">Add items to get started</p>
                  </motion.div>
                ) : (
                  cartItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex gap-4 border border-white/8 rounded-3xl bg-white/[0.03] p-4 hover:border-[#D4AF37]/18 transition-all"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-black border border-white/8 p-3 shrink-0">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h4 className="text-sm font-medium text-white line-clamp-2">
                              {item.product?.name}
                            </h4>
                            <p className="text-xs text-[#D4AF37] mt-2">
                              {item.product?.category}
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>

                        <div className="flex justify-between items-center mt-5 gap-4">
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                            <Minus
                              size={14}
                              className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            />
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="text-sm font-semibold w-5 text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            <Plus
                              size={14}
                              className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            />
                          </div>

                          <p className="text-lg font-bold text-white">
                            LKR{' '}
                            {(
                              ((item.product?.discountedPrice || item.product?.price || 0) *
                                item.quantity) || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 lg:p-8 bg-white/[0.03] border-t border-white/10">
                <div className="flex justify-between items-end mb-8 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Grand Total</p>
                    <motion.p
                      key={calculateTotal()}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl lg:text-5xl font-black text-[#D4AF37] tracking-tight mt-2"
                    >
                      LKR {calculateTotal().toLocaleString()}
                    </motion.p>
                  </div>

                  <div className="text-right">
                    <ShieldCheck size={22} className="text-green-500 ml-auto" />
                    <p className="text-xs font-medium text-green-400 mt-2">
                      Authorized Secure
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    localStorage.setItem('lastCartTotal', calculateTotal());
                    navigate('/checkout');
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black py-4 text-sm font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-3 group"
                >
                  <CreditCard size={18} className="group-hover:scale-110 transition-transform" />
                  Initialize Order
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B8960F;
        }
      `}</style>
    </div>
  );
};

const TopUserChip = ({ user, currentTime }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-4 self-start lg:self-auto rounded-[24px] border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent px-4 py-3 backdrop-blur-xl"
  >
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center shrink-0">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={user?.name || 'Profile'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-[#D4AF37]">
          {getInitials(user?.name)}
        </span>
      )}
    </div>

    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-gray-500 flex items-center gap-1">
        <ShieldCheck size={10} className="text-green-500" />
        Logged in as
      </p>
      <p className="text-sm font-bold text-white">
        {user?.name || 'Authorized Guest'}
      </p>
    </div>

    <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10">
      <Clock size={12} className="text-[#D4AF37]" />
      <p className="text-xs font-mono text-gray-400">
        {currentTime.toLocaleTimeString()}
      </p>
    </div>
  </motion.div>
);

const getInitials = (name) => {
  const parts = (name || 'User').trim().split(' ');
  const first = parts[0]?.charAt(0) || '';
  const second = parts[1]?.charAt(0) || '';
  return `${first}${second}`.toUpperCase() || 'U';
};

const QuickFilterChip = ({ active, onClick, label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
      active
        ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
        : 'border-white/10 text-gray-300 hover:border-[#D4AF37]/30 hover:text-white bg-white/[0.03]'
    }`}
  >
    {label}
  </motion.button>
);

const SideNavItem = ({ icon, label, active = false, onClick, collapsed = false, index = 0 }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ x: collapsed ? 0 : 6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center ${
      collapsed ? 'justify-center' : 'justify-between'
    } rounded-[22px] px-4 py-4 transition-all duration-300 group ${
      active
        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black shadow-[0_10px_25px_rgba(212,175,55,0.2)]'
        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/8'
    }`}
  >
    <div className={`flex items-center ${collapsed ? '' : 'gap-3'} min-w-0`}>
      <motion.span
        animate={active ? { rotate: [0, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="shrink-0"
      >
        {icon}
      </motion.span>
      {!collapsed && <span className="text-[15px] font-medium truncate">{label}</span>}
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

    {active && !collapsed && (
      <motion.div
        layoutId="activeNav"
        className="absolute left-0 w-1 h-full bg-[#D4AF37] rounded-r-full"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
  </motion.button>
);

const LuxuryStatCard = ({ icon, label, value, sub, gradient }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, borderColor: 'rgba(212,175,55,0.3)' }}
    className={`rounded-[30px] border border-white/10 bg-gradient-to-br ${gradient} backdrop-blur-xl px-6 py-6 relative overflow-hidden group cursor-pointer`}
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"
    />
    
    <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
    
    <div className="flex items-center justify-between gap-4 relative z-10">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-black tracking-tight text-white mt-3"
        >
          {value}
        </motion.p>
        <p className="text-sm text-gray-400 mt-3">{sub}</p>
      </div>
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-12 h-12 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]"
      >
        {icon}
      </motion.div>
    </div>
  </motion.div>
);

const LuxuryProductCard = ({ product, navigate, onAddToCart, onProductClick, isInitiallyCurated, index }) => {
  const [isCurated, setIsCurated] = useState(isInitiallyCurated);
  const [isHovered, setIsHovered] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setIsCurated(isInitiallyCurated);
  }, [isInitiallyCurated]);

  const hasDiscount =
    product?.discountedPrice && product.discountedPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleQuickPurchase = async (e) => {
    e.stopPropagation();
    const success = await onAddToCart();
    if (success) {
      const activePrice = hasDiscount ? product.discountedPrice || 0 : product.price || 0;
      localStorage.setItem('lastCartTotal', activePrice);
      navigate('/checkout');
    }
  };

  const handleToggleCurated = async (e) => {
    e.stopPropagation();

    if (!user.id) return toast.error('Log in to curate assets');

    const method = isCurated ? 'DELETE' : 'POST';
    const endpoint = isCurated
      ? `/api/curated/remove-link?userId=${user.id}&productId=${product.id}`
      : `/api/curated/add?userId=${user.id}&productId=${product.id}`;

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, { method });
      if (res.ok) {
        setIsCurated(!isCurated);
        toast.success(isCurated ? 'Asset De-curated' : 'Asset Archived', {
          icon: isCurated ? '💔' : '❤️',
          style: {
            borderRadius: '12px',
            background: '#000',
            color: '#D4AF37',
            border: '1px solid #D4AF37',
            fontSize: '12px'
          }
        });
      }
    } catch (err) {
      toast.error('Registry Error');
    }
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, delay: index * 0.05, type: 'spring', stiffness: 200 }
        }
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onProductClick()}
      className="group relative bg-gradient-to-br from-[#060606] to-black border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-500 overflow-hidden cursor-pointer rounded-3xl"
    >
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none"
      />

      <div className="relative aspect-[4/4.8] bg-gradient-to-b from-[#080808] to-black border-b border-white/8 overflow-hidden group">
        {hasDiscount && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-5 left-5 z-20 rounded-full border border-[#D4AF37]/25 bg-black/60 backdrop-blur-sm text-[#D4AF37] px-4 py-2 text-xs font-medium flex items-center gap-2"
          >
            <Sparkles size={11} className="animate-pulse" />
            {discountPercent}% OFF
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleCurated}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <Heart
            size={17}
            className={
              isCurated
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'text-white/55 hover:text-white'
            }
          />
        </motion.button>

        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-10 transition-transform duration-500"
        />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onProductClick();
            }}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/8 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center"
          >
            <Eye size={17} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8960F] hover:from-white hover:to-white text-black transition-all flex items-center justify-center shadow-[0_0_26px_rgba(212,175,55,0.3)]"
          >
            <ShoppingCart size={17} />
          </motion.button>
        </div>
      </div>

      <div className="p-6 flex flex-col min-h-[280px]">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3 font-bold">
            {product.category}
          </p>

          <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight leading-snug text-white line-clamp-2 min-h-[56px] group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="border-l-2 border-[#D4AF37]/30 pl-4 mb-6">
            <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500 mb-2">
              Net Valuation
            </p>

            <div className="flex items-end gap-3 flex-wrap">
              <motion.span
                key={hasDiscount ? product.discountedPrice : product.price}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-none"
              >
                LKR {(hasDiscount ? product.discountedPrice || 0 : product.price || 0).toLocaleString()}
              </motion.span>

              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through mb-1">
                  {(product.price || 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onProductClick();
              }}
              className="border border-white/10 hover:border-white/20 transition-all py-3 text-sm font-medium text-white bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-2 rounded-xl"
            >
              Details <ArrowUpRight size={14} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all py-3 text-sm font-medium flex items-center justify-center gap-2 rounded-xl"
            >
              Add <ShoppingCart size={14} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickPurchase}
            className="w-full border border-white/10 hover:border-[#D4AF37] transition-all py-3 text-sm font-medium text-white hover:text-black relative overflow-hidden rounded-xl group/btn"
          >
            <motion.div
              initial={{ y: '100%' }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8960F]"
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Buy Now <ChevronRight size={14} />
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

const ProductListView = ({ product, navigate, onAddToCart, onProductClick, isInitiallyCurated, index }) => {
  const [isCurated, setIsCurated] = useState(isInitiallyCurated);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setIsCurated(isInitiallyCurated);
  }, [isInitiallyCurated]);

  const hasDiscount = product?.discountedPrice && product.discountedPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;

  const handleToggleCurated = async (e) => {
    e.stopPropagation();
    if (!user.id) return toast.error('Log in to curate assets');

    const method = isCurated ? 'DELETE' : 'POST';
    const endpoint = isCurated
      ? `/api/curated/remove-link?userId=${user.id}&productId=${product.id}`
      : `/api/curated/add?userId=${user.id}&productId=${product.id}`;

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, { method });
      if (res.ok) {
        setIsCurated(!isCurated);
        toast.success(isCurated ? 'Removed from curated' : 'Added to curated');
      }
    } catch (err) {
      toast.error('Registry Error');
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: index * 0.03 } }
      }}
      whileHover={{ x: 8, borderColor: 'rgba(212,175,55,0.4)' }}
      onClick={() => onProductClick()}
      className="flex gap-6 p-5 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
    >
      <div className="w-28 h-28 shrink-0 bg-black rounded-xl border border-white/10 p-3">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-xs text-[#D4AF37] font-bold mb-1">{product.category}</p>
            <h3 className="text-lg font-bold text-white">{product.name}</h3>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{product.description}</p>
          </div>
          <button onClick={handleToggleCurated}>
            <Heart size={20} className={isCurated ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#D4AF37]">
                LKR {(hasDiscount ? product.discountedPrice : product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  LKR {product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
            className="px-6 py-2 bg-[#D4AF37] text-black rounded-xl text-sm font-bold hover:bg-white transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;