import React, { useEffect, useMemo, useState } from 'react';
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
  ListFilter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Range, getTrackBackground } from "react-range";
import CustomerAnnouncement from '../components/CustomerAnnouncement';

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

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Authorized Guest"}');

  useEffect(() => {
    fetchProducts();
    if (user.id) {
      fetchCart();
      fetchCuratedRegistry();
    }
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products/all')
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setProducts(safeData);
      })
      .catch(() => toast.error('Hardware Registry Offline'));
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

  // Auto filter logic with useEffect
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

    // PRICE FILTER with slider values
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
            active
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/customer-dashboard')}
          />
          <SideNavItem
            icon={<Package size={18} />}
            label="Order History"
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
                Verified Session
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Secure customer portal with refined purchasing and curated inventory access.
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
                Dashboard
              </h2>
            </div>

            <TopUserChip user={user} />
          </motion.div>

          {/* HERO ANNOUNCEMENT WRAP */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-12"
          >
            <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur-2xl p-4 sm:p-5 lg:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <CustomerAnnouncement onSecureOffer={triggerSecureOffer} />
            </div>
          </motion.section>

          {/* TOP STATS */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.06
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
          >
            <LuxuryStatCard
              icon={<Boxes size={20} />}
              label="Active Products"
              value={products.length.toLocaleString()}
              sub="Verified items in registry"
            />
            <LuxuryStatCard
              icon={<ShoppingCart size={20} />}
              label="Cart Assets"
              value={cartItems.length.toLocaleString()}
              sub="Ready for checkout"
            />
            <LuxuryStatCard
              icon={<Sparkles size={20} />}
              label="Promotional Items"
              value={
                products.filter((p) => p.discountedPrice && p.discountedPrice < p.price).length.toLocaleString()
              }
              sub="Discounted inventory"
            />
          </motion.section>

          {/* HEADER */}
          <header
            id="market-registry-section"
            className="flex flex-col 2xl:flex-row justify-between items-start gap-10 mb-14"
          >
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#D4AF37]">
                  Secure Customer Session
                </p>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[0.92]">
                Premium Industrial Assets
              </h1>

              <p className="text-base text-gray-400 mt-5 max-w-2xl leading-relaxed">
                Explore a refined hardware registry with curated tools, verified pricing,
                and secure purchase flow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full 2xl:w-auto flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search registry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-[420px] rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-5 text-sm outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-500"
                  />
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative h-[56px] w-[56px] rounded-2xl bg-[#D4AF37]/8 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center shrink-0"
                >
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                    {cartItems.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-white text-black text-[11px] font-bold flex items-center justify-center rounded-full border border-black"
                      >
                        {cartItems.length}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* NEW SLIDER UI - REPLACED OLD FILTER */}
                <div className="mb-6 p-6 border border-white/10 rounded-xl bg-white/[0.02] max-w-md">
                  <h3 className="text-[#D4AF37] font-bold mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={16} /> Filter by Price
                  </h3>

                  <div className="flex justify-between text-sm mb-4">
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
                  <ListFilter
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none"
                  />
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setFilterMode('all');
                    }}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-[#050505] pl-11 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/40 transition-all appearance-none"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'ALL' ? 'SELECT CATEGORY...' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <SlidersHorizontal
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none"
                  />
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-[#050505] pl-11 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/40 transition-all appearance-none"
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
                  className={`h-14 rounded-2xl text-sm font-medium border transition-all ${
                    filterMode === 'offers'
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                      : 'border-white/10 text-gray-300 hover:border-[#D4AF37]/30 hover:text-white bg-white/[0.03]'
                  }`}
                >
                  {filterMode === 'offers' ? 'Clear Offer Filter' : 'Show Offers Only'}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
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
                  label="Promotions"
                />

                <QuickFilterChip
                  active={category === 'POWER TOOLS' && filterMode === 'all'}
                  onClick={() => {
                    setCategory('POWER TOOLS');
                    setFilterMode('all');
                  }}
                  label="Power Tools"
                />

                <QuickFilterChip
                  active={category === 'SAFETY GEAR' && filterMode === 'all'}
                  onClick={() => {
                    setCategory('SAFETY GEAR');
                    setFilterMode('all');
                  }}
                  label="Safety Gear"
                />
              </div>
            </motion.div>
          </header>

          {/* PRODUCT GRID - USING filteredProductsState */}
          {filteredProductsState.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Package className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No products found</h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                No products match your current category, search, or sorting filters.
              </p>
            </div>
          ) : (
            <motion.section
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.06
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7"
            >
              {filteredProductsState.map((product) => (
                <LuxuryProductCard
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onAddToCart={() => handleAddToCart(product)}
                  isInitiallyCurated={curatedIds.includes(product.id)}
                />
              ))}
            </motion.section>
          )}
        </div>
      </main>

      {/* CART */}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#080808] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 lg:p-8 border-b border-white/8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Cart Registry</h2>
                  <p className="text-sm text-gray-500 mt-1">Secure purchase preparation</p>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600">
                    <ShoppingCart size={90} strokeWidth={1.2} />
                    <p className="font-medium mt-6 text-lg">Empty Registry</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
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

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-5 gap-4">
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                            <Minus
                              size={14}
                              className="cursor-pointer hover:text-[#D4AF37]"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            />
                            <span className="text-sm font-semibold w-5 text-center">
                              {item.quantity}
                            </span>
                            <Plus
                              size={14}
                              className="cursor-pointer hover:text-[#D4AF37]"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            />
                          </div>

                          <p className="text-lg font-semibold text-white">
                            LKR{' '}
                            {(
                              ((item.product?.discountedPrice || item.product?.price || 0) *
                                item.quantity) || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 lg:p-8 bg-white/[0.03] border-t border-white/10">
                <div className="flex justify-between items-end mb-8 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Grand Total</p>
                    <p className="text-4xl lg:text-5xl font-black text-[#D4AF37] tracking-tight mt-2">
                      LKR {calculateTotal().toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <ShieldCheck size={22} className="text-green-500 ml-auto" />
                    <p className="text-xs font-medium text-green-400 mt-2">
                      Authorized Secure
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem('lastCartTotal', calculateTotal());
                    navigate('/checkout');
                  }}
                  className="w-full rounded-2xl bg-[#D4AF37] text-black py-4 text-sm font-semibold hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <CreditCard size={18} />
                  Initialize Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 999px;
        }
      `}</style>
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

const QuickFilterChip = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
      active
        ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
        : 'border-white/10 text-gray-300 hover:border-[#D4AF37]/30 hover:text-white bg-white/[0.03]'
    }`}
  >
    {label}
  </button>
);

const SideNavItem = ({ icon, label, active = false, onClick, collapsed = false }) => (
  <motion.button
    whileHover={{ x: collapsed ? 0 : 4 }}
    whileTap={{ scale: 0.985 }}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center ${
      collapsed ? 'justify-center' : 'justify-between'
    } rounded-[22px] px-4 py-4 transition-all ${
      active
        ? 'bg-[#D4AF37] text-black shadow-[0_14px_28px_rgba(212,175,55,0.18)]'
        : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/8'
    }`}
  >
    <div className={`flex items-center ${collapsed ? '' : 'gap-3'} min-w-0`}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="text-[15px] font-medium truncate">{label}</span>}
    </div>

    {!collapsed && active && <ChevronRight size={16} />}
  </motion.button>
);

const LuxuryStatCard = ({ icon, label, value, sub }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' }
      }
    }}
    className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur-xl px-6 py-6 relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 h-full w-[2px] bg-[#D4AF37]/45" />
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-4xl font-black tracking-tight text-white mt-3">{value}</p>
        <p className="text-sm text-gray-400 mt-3">{sub}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
        {icon}
      </div>
    </div>
  </motion.div>
);

const LuxuryProductCard = ({ product, navigate, onAddToCart, isInitiallyCurated }) => {
  const [isCurated, setIsCurated] = useState(isInitiallyCurated);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setIsCurated(isInitiallyCurated);
  }, [isInitiallyCurated]);

  const hasDiscount =
    product?.discountedPrice && product.discountedPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleQuickPurchase = async () => {
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
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: 'easeOut' }
        }
      }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#060606] border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.06),transparent_34%)] pointer-events-none" />

      <div className="relative aspect-[4/4.8] bg-[#080808] border-b border-white/8 overflow-hidden">
        {hasDiscount && (
          <div className="absolute top-5 left-5 z-20 rounded-full border border-[#D4AF37]/25 bg-black/60 backdrop-blur-sm text-[#D4AF37] px-4 py-2 text-xs font-medium flex items-center gap-2">
            <Sparkles size={11} />
            {discountPercent}% Reduction
          </div>
        )}

        <button
          onClick={handleToggleCurated}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/55 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Heart
            size={17}
            className={
              isCurated
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'text-white/55 hover:text-white'
            }
          />
        </button>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-10 transition-transform duration-[2.8s] group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/92 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/8 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center"
          >
            <Eye size={17} />
          </button>

          <button
            onClick={onAddToCart}
            className="w-11 h-11 rounded-full border border-[#D4AF37] bg-[#D4AF37] hover:bg-white text-black transition-all flex items-center justify-center shadow-[0_0_26px_rgba(212,175,55,0.2)]"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col min-h-[280px]">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]/75 mb-4 font-medium">
            {product.category}
          </p>

          <h3 className="text-[20px] sm:text-[22px] font-medium tracking-tight leading-snug text-white line-clamp-2 min-h-[58px]">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="border-l border-[#D4AF37]/18 pl-5 mb-8">
            <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mb-3">
              Net Valuation
            </p>

            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-[30px] sm:text-[34px] font-semibold tracking-tight text-white leading-none">
                LKR {(hasDiscount ? product.discountedPrice || 0 : product.price || 0).toLocaleString()}
              </span>

              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through mb-1">
                  {(product.price || 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="border border-white/10 hover:border-white/20 transition-all py-4 text-sm font-medium text-white bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center gap-2"
            >
              View Asset <ArrowUpRight size={15} />
            </button>

            <button
              onClick={onAddToCart}
              className="border border-[#D4AF37]/25 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all py-4 text-sm font-medium flex items-center justify-center gap-2"
            >
              Add to Cart <ShoppingCart size={15} />
            </button>
          </div>

          <button
            onClick={handleQuickPurchase}
            className="w-full border border-white/10 hover:border-[#D4AF37] transition-all py-4 text-sm font-medium text-white hover:text-black relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Initialize Purchase <ChevronRight size={15} />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default CustomerDashboard;