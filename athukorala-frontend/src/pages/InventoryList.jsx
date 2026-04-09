import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  Box,
  TrendingDown,
  Layers3,
  ShieldCheck,
  Package2,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpdateProductModal from './UpdateProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import StockMovementPanel from '../components/StockMovementPanel';

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const [productRes, inventoryRes] = await Promise.all([
        fetch('http://localhost:8080/api/products/all'),
        fetch('http://localhost:8080/api/inventory')
      ]);

      if (!productRes.ok || !inventoryRes.ok) {
        throw new Error('Failed to fetch');
      }

      const productsData = await productRes.json();
      const inventoryData = await inventoryRes.json();

      const safeProducts = Array.isArray(productsData) ? productsData : [];
      const safeInventory = Array.isArray(inventoryData) ? inventoryData : [];

      const merged = safeProducts.map((product) => {
        const inventoryItem = safeInventory.find((item) => item.productId === product.id);

        return {
          ...product,
          stockQuantity: Number(inventoryItem?.quantity ?? product.stockQuantity ?? 0),
          reorderLevel: Number(inventoryItem?.reorderLevel ?? 5)
        };
      });

      setProducts(merged);
    } catch (error) {
      toast.error('Unable to load inventory');
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const executeDelete = async () => {
    if (!selectedProduct) return;

    const loadingToast = toast.loading('Executing Delete Protocol...');

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedProduct.id}`,
        {
          method: 'DELETE'
        }
      );

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        toast.success(result.message || 'Asset Successfully Purged', {
          id: loadingToast
        });
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(result.message || 'Authorization Denied or System Error', {
          id: loadingToast,
          duration: 4000
        });
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      toast.error('Connection Failed: Ensure Backend is Online', {
        id: loadingToast
      });
    }
  };

  const stockIn = async (productId) => {
    const loadingToast = toast.loading('Processing Stock-In...');

    try {
      const response = await fetch('http://localhost:8080/api/inventory/stock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 10,
          note: 'Manual stock in',
          referenceCode: `MANUAL-IN-${productId}`
        })
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        toast.success(result.message || 'Stock Added Successfully', {
          id: loadingToast
        });
        fetchProducts();
      } else {
        toast.error(result.message || 'Stock-In Failed', {
          id: loadingToast
        });
      }
    } catch (error) {
      toast.error('Connection Failed: Backend Unreachable', {
        id: loadingToast
      });
    }
  };

  const stockOut = async (productId) => {
    const loadingToast = toast.loading('Processing Stock-Out...');

    try {
      const response = await fetch('http://localhost:8080/api/inventory/stock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 5,
          reason: 'SALE',
          note: 'Manual stock out',
          referenceCode: `MANUAL-OUT-${productId}`
        })
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        toast.success(result.message || 'Stock Removed Successfully', {
          id: loadingToast
        });
        fetchProducts();
      } else {
        toast.error(result.message || 'Stock-Out Failed', {
          id: loadingToast
        });
      }
    } catch (error) {
      toast.error('Connection Failed: Backend Unreachable', {
        id: loadingToast
      });
    }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;

      const name = product.name?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';

      return (
        name.includes(term) ||
        category.includes(term) ||
        description.includes(term)
      );
    });
  }, [products, searchTerm]);

  const totalProducts = products.length;
  const discountedProducts = products.filter(
    (p) => p.discountedPrice && Number(p.discountedPrice) < Number(p.price)
  ).length;
  const lowStockProducts = products.filter(
    (p) => Number(p.stockQuantity || 0) <= Number(p.reorderLevel || 5)
  ).length;
  const totalUnits = products.reduce(
    (sum, p) => sum + Number(p.stockQuantity || 0),
    0
  );

  const getStockStatus = (qty, reorderLevel = 5) => {
    const numericQty = Number(qty || 0);
    const numericReorder = Number(reorderLevel || 5);

    if (numericQty <= 0) {
      return {
        label: 'OUT OF STOCK',
        badge: 'bg-red-500/15 text-red-400 border-red-500/20',
        bar: 'bg-red-500'
      };
    }

    if (numericQty <= numericReorder) {
      return {
        label: 'LOW STOCK',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
        bar: 'bg-amber-400'
      };
    }

    return {
      label: 'IN STOCK',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      bar: 'bg-emerald-500'
    };
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.30)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_28%)] pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37] mb-3">
              Registry Control
            </p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              Inventory List
            </h2>
            <p className="text-sm text-gray-400 mt-3 max-w-2xl">
              View, search, update, and control every registered product with
              real-time inventory visibility.
            </p>
          </div>

          <div className="relative w-full xl:w-[360px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search inventory by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all focus:border-[#D4AF37]/60 focus:bg-black/40"
            />
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400 font-semibold">
                Total Products
              </p>
              <h3 className="text-3xl font-black text-white mt-2">
                {totalProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
              <Layers3 className="text-[#D4AF37]" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#D4AF37]/15 bg-[#D4AF37]/6 backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
                Promo Active
              </p>
              <h3 className="text-3xl font-black text-white mt-2">
                {discountedProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 flex items-center justify-center">
              <TrendingDown className="text-[#D4AF37]" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-red-500/15 bg-red-500/6 backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-red-300 font-semibold">
                Low Stock
              </p>
              <h3 className="text-3xl font-black text-white mt-2">
                {lowStockProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-red-500/20 bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="text-red-400" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400 font-semibold">
                Total Units
              </p>
              <h3 className="text-3xl font-black text-white mt-2">
                {totalUnits}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
              <Package2 className="text-emerald-400" size={22} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* TABLE */}
      <motion.div
        variants={itemVariants}
        className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
              <ShieldCheck className="text-[#D4AF37]" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Live Inventory Registry</p>
              <p className="text-xs text-gray-400">
                {filteredProducts.length} visible item
                {filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-white/[0.02]">
              <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                <th className="px-6 py-4 font-semibold">Asset</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Reorder</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const hasDiscount =
                    product.discountedPrice &&
                    Number(product.discountedPrice) < Number(product.price);

                  const discountPercent = hasDiscount
                    ? Math.round(
                        ((Number(product.price) - Number(product.discountedPrice)) /
                          Number(product.price)) *
                          100
                      )
                    : 0;

                  const stockQty = Number(product.stockQuantity || 0);
                  const reorderLevel = Number(product.reorderLevel || 5);
                  const stockStatus = getStockStatus(stockQty, reorderLevel);

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-t border-white/6 hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="w-16 h-16 rounded-2xl border border-white/10 bg-black/35 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/30 transition-all">
                          <img
                            src={
                              product.imageUrl ||
                              'https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png'
                            }
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-1 uppercase tracking-[0.18em]">
                            Ref #{String(product.id).padStart(4, '0')}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                          {product.category || 'UNCATEGORIZED'}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {hasDiscount ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 line-through">
                                LKR {Number(product.price || 0).toLocaleString()}
                              </span>
                              <span className="rounded-full bg-red-500/15 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                                -{discountPercent}%
                              </span>
                            </div>
                            <span className="text-base font-black text-[#D4AF37]">
                              LKR {Number(product.discountedPrice || 0).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                              Standard Price
                            </span>
                            <span className="text-base font-bold text-white">
                              LKR {Number(product.price || 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">
                              {stockQty} units
                            </span>
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] ${stockStatus.badge}`}
                            >
                              {stockStatus.label}
                            </span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-white/6 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min((stockQty / Math.max(reorderLevel * 2, 10)) * 100, 100)}%`
                              }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`h-full ${stockStatus.bar}`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                            Reorder Level
                          </span>
                          <span className="text-base font-bold text-white">
                            {reorderLevel}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                          <button
                            onClick={() => stockIn(product.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-green-500/15 bg-green-500/8 px-4 py-2.5 text-sm font-semibold text-green-300 transition-all hover:border-green-500/40 hover:bg-green-500/12 hover:text-green-200"
                            title="Stock In"
                          >
                            <Plus size={16} />
                            Stock In
                          </button>

                          <button
                            onClick={() => stockOut(product.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/15 bg-amber-500/8 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/12 hover:text-amber-200"
                            title="Stock Out"
                          >
                            <Minus size={16} />
                            Stock Out
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsUpdateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-[#D4AF37]/40 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8"
                            title="Update Entry"
                          >
                            <Edit size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-300 transition-all hover:border-red-500/40 hover:bg-red-500/12 hover:text-red-200"
                            title="Purge Asset"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center mb-4">
                        <Box className="text-gray-500" size={26} />
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        No products found
                      </h3>
                      <p className="text-sm text-gray-400 mt-2 max-w-md">
                        Try changing the search term or add products to the
                        inventory registry.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateProductModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onUpdateSuccess={fetchProducts}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
            onConfirm={executeDelete}
            itemName={selectedProduct?.name}
          />
        )}
      </AnimatePresence>

      {/* STOCK MOVEMENT PANEL */}
      <motion.div variants={itemVariants}>
        <StockMovementPanel />
      </motion.div>
    </motion.div>
  );
};

export default InventoryList;