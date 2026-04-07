import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Activity,
  Info,
  Award,
  Cpu,
  Boxes,
  ArrowUpRight,
  BadgeCheck,
  Minus,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest"}');

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedQuantity(1);
      })
      .catch(() => toast.error('Hardware registry sync failed'));
  }, [id]);

  const hasDiscount =
    product?.discountedPrice && product.discountedPrice < product.price;

  const activePrice = hasDiscount ? product?.discountedPrice || 0 : product?.price || 0;

  const availableStock = Number(product?.stockQuantity || 0);

  const increaseQuantity = () => {
    if (!product) return;

    if (selectedQuantity >= availableStock) {
      toast.error(`Maximum available quantity is ${availableStock}`);
      return;
    }

    setSelectedQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (selectedQuantity <= 1) return;
    setSelectedQuantity((prev) => prev - 1);
  };

  const handleQuantityInput = (e) => {
    const value = e.target.value;

    if (value === '') {
      setSelectedQuantity('');
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    if (numericValue < 1) {
      setSelectedQuantity(1);
      return;
    }

    if (numericValue > availableStock) {
      setSelectedQuantity(availableStock);
      return;
    }

    setSelectedQuantity(numericValue);
  };

  const normalizeQuantity = () => {
    if (selectedQuantity === '' || Number.isNaN(Number(selectedQuantity))) {
      setSelectedQuantity(1);
      return;
    }

    if (selectedQuantity < 1) {
      setSelectedQuantity(1);
      return;
    }

    if (selectedQuantity > availableStock) {
      setSelectedQuantity(availableStock);
    }
  };

  const handleInitializePurchase = async () => {
    if (user.name === 'Guest') {
      toast.error('AUTHENTICATION REQUIRED');
      return;
    }

    if (!product) return;

    if (availableStock <= 0) {
      toast.error('PRODUCT OUT OF STOCK');
      return;
    }

    const qty = Number(selectedQuantity);

    if (!qty || qty < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (qty > availableStock) {
      toast.error(`Quantity cannot exceed ${availableStock}`);
      return;
    }

    const loadingToast = toast.loading('Syncing Registry...');
    try {
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: qty
        })
      });

      if (response.ok) {
        localStorage.setItem('lastCartTotal', activePrice * qty);
        toast.success('Redirecting to Payment...', { id: loadingToast });
        setTimeout(() => navigate('/checkout'), 1000);
      } else {
        toast.error('Registry Handshake Failed', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Backend Offline', { id: loadingToast });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-[#D4AF37] text-sm font-medium tracking-[0.28em] uppercase"
        >
          Loading Product Registry...
        </motion.div>
      </div>
    );
  }

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white px-5 sm:px-8 lg:px-12 2xl:px-20 py-8 lg:py-10 font-sans relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.04, 0.08, 0.04]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[900px] h-[900px] bg-[#D4AF37] blur-[180px] rounded-full -z-10 pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.02, 0.05, 0.02]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-white blur-[180px] rounded-full -z-10 pointer-events-none"
      />

      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-3 text-sm text-gray-400 hover:text-[#D4AF37] transition-all mb-10 lg:mb-14"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Back to Catalog</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10 lg:mb-14"
      >
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-[#D4AF37] text-xs font-medium">
            <BadgeCheck size={14} />
            Verified Product
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300 text-xs font-medium">
            <Boxes size={14} />
            {product.category}
          </div>

          {hasDiscount && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-black/40 px-4 py-2 text-[#D4AF37] text-xs font-medium">
              <Sparkles size={14} />
              {discountPercent}% Promotion Active
            </div>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.92] max-w-5xl">
          {product.name}
        </h1>

        <p className="mt-5 text-base text-gray-400 max-w-3xl leading-relaxed">
          Premium industrial-grade product with verified quality, secure purchasing
          workflow, and refined presentation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
        <div className="xl:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative aspect-square rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
          >
            <motion.div
              animate={{ x: ['-100%', '120%'] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
            />

            <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <p className="text-xs text-gray-400 font-medium">Live Asset Feed</p>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.07),transparent_38%)]" />

            <motion.img
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-10 sm:p-14 drop-shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </div>

        <div className="xl:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl p-8 lg:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D4AF37]/55" />

            <p className="text-sm text-gray-500 font-medium">Industrial Valuation</p>

            <div className="flex items-end gap-4 flex-wrap mt-5">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                LKR {activePrice?.toLocaleString()}
              </span>

              {hasDiscount && (
                <span className="text-xl sm:text-2xl text-gray-500 line-through mb-2">
                  LKR {product.price?.toLocaleString()}
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-[#D4AF37] text-sm font-medium">
                <Sparkles size={14} />
                Promotional reduction applied
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 lg:p-7"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#D4AF37] font-medium mb-2">
                  Purchase Quantity
                </p>
                <p className="text-sm text-gray-400">
                  Select between 1 and {availableStock} unit{availableStock === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3 w-fit">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={selectedQuantity <= 1}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={selectedQuantity}
                  onChange={handleQuantityInput}
                  onBlur={normalizeQuantity}
                  className="w-20 text-center bg-transparent outline-none text-xl font-semibold text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={selectedQuantity >= availableStock}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-gray-300">
                Selected: <span className="text-white font-semibold">{selectedQuantity}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm text-[#D4AF37]">
                Total: LKR {(activePrice * Number(selectedQuantity || 1)).toLocaleString()}
              </div>
            </div>
          </motion.div>

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
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <SpecItem
              icon={<Info />}
              label="Description"
              content={product.description || 'Unregistered'}
            />
            <SpecItem
              icon={<Activity />}
              label="Stock Status"
              content={`${product.stockQuantity || 0} Units Available`}
              color={product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}
            />
            <SpecItem
              icon={<Award />}
              label="Authenticity"
              content="Athukorala Certified"
            />
            <SpecItem
              icon={<Cpu />}
              label="Technical Framework"
              content="Standard Industrial V3"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <button
              onClick={() => navigate('/customer-dashboard')}
              className="sm:col-span-1 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all py-4 rounded-2xl text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              View Catalog <ArrowUpRight size={16} />
            </button>

            <button
              onClick={handleInitializePurchase}
              disabled={availableStock <= 0}
              className="sm:col-span-2 relative overflow-hidden rounded-2xl bg-[#D4AF37] text-black py-4 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_40px_rgba(212,175,55,0.18)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              Initialize Purchase
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="rounded-[30px] border border-[#D4AF37]/12 bg-[#D4AF37]/[0.04] p-7 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-[#D4AF37]" />
              <p className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.14em]">
                Purchase Assurance
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed">
              This product can be securely added to cart and moved into the payment
              workflow through your verified customer session.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ icon, label, content, color = 'text-white' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.42, ease: 'easeOut' }
      }
    }}
    className="rounded-[26px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 lg:p-7 hover:border-[#D4AF37]/22 transition-all"
  >
    <div className="flex items-center gap-3 text-[#D4AF37] mb-4">
      {React.cloneElement(icon, { size: 16 })}
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#D4AF37]">
        {label}
      </span>
    </div>

    <p className={`text-sm sm:text-base font-medium leading-relaxed ${color}`}>
      {content}
    </p>
  </motion.div>
);

export default ProductDetail;