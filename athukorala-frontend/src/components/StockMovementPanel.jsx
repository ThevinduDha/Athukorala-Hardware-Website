import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Package,
  Search,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StockMovementPanel = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products/all');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error('PRODUCT REGISTRY OFFLINE');
      setProducts([]);
    }
  };

  const fetchMovements = async (productId) => {
    if (!productId) {
      setMovements([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/inventory/${productId}/movements`);
      const data = await res.json();
      setMovements(Array.isArray(data) ? data : []);
    } catch {
      toast.error('MOVEMENT HISTORY OFFLINE');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchMovements(selectedProductId);
  }, [selectedProductId]);

  const handleDeleteMovement = async (movementId) => {
    if (!isAdmin) {
      toast.error('ADMIN ACCESS REQUIRED');
      return;
    }

    const ok = window.confirm(
      'Delete this stock movement? This should revert stock automatically.'
    );
    if (!ok) return;

    const loadingToast = toast.loading('REVERSING MOVEMENT...');

    try {
      const res = await fetch(
        `http://localhost:8080/api/inventory/movements/${movementId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        toast.success('MOVEMENT DELETED AND STOCK REVERTED', { id: loadingToast });
        fetchMovements(selectedProductId);
      } else {
        const text = await res.text();
        toast.error(text || 'DELETE FAILED', { id: loadingToast });
      }
    } catch {
      toast.error('DELETE FAILED', { id: loadingToast });
    }
  };

  const filteredMovements = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return movements;

    return movements.filter((m) => {
      const type = (m.movementType || m.type || '').toLowerCase();
      const reason = (m.reason || '').toLowerCase();
      const note = (m.note || '').toLowerCase();
      const ref = (m.referenceCode || '').toLowerCase();

      return (
        type.includes(term) ||
        reason.includes(term) ||
        note.includes(term) ||
        ref.includes(term)
      );
    });
  }, [movements, searchTerm]);

  const getTypeStyle = (movement) => {
    const type = String(movement.movementType || movement.type || '').toUpperCase();

    if (type === 'IN') {
      return {
        label: 'STOCK IN',
        icon: <ArrowDownCircle size={15} />,
        badge: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/20'
      };
    }

    if (type === 'OUT') {
      return {
        label: 'STOCK OUT',
        icon: <ArrowUpCircle size={15} />,
        badge: 'bg-red-500/12 text-red-400 border-red-500/20'
      };
    }

    return {
      label: type || 'ADJUST',
      icon: <SlidersHorizontal size={15} />,
      badge: 'bg-amber-500/12 text-amber-300 border-amber-500/20'
    };
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId)
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <History size={18} className="text-[#D4AF37]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            Audit Trail
          </p>
        </div>

        <h2 className="text-3xl font-black text-white">Stock Movement History</h2>
        <p className="text-sm text-gray-400 mt-3 max-w-3xl">
          View stock in, stock out, and adjustment history for each product.
          Admins can remove incorrect movement records and let the system revert stock.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
          <label className="text-xs uppercase tracking-[0.25em] text-gray-400 block mb-3">
            Select Product
          </label>

          <div className="relative">
            <Package
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              size={16}
            />
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 py-4 text-sm text-white outline-none focus:border-[#D4AF37]/60"
            >
              <option value="">Choose product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Current Target
              </p>
              <p className="text-white font-bold mt-2">{selectedProduct.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                Ref #{String(selectedProduct.id).padStart(4, '0')}
              </p>
            </div>
          )}
        </div>

        <div className="xl:col-span-2 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-white/10 bg-black/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">
                {selectedProduct
                  ? `${selectedProduct.name} Movement Log`
                  : 'Movement Log'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {filteredMovements.length} visible record
                {filteredMovements.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search reason, type, note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#D4AF37]/60"
              />
            </div>
          </div>

          {!selectedProductId ? (
            <div className="px-6 py-20 text-center">
              <p className="text-lg font-bold text-white">Select a product first</p>
              <p className="text-sm text-gray-400 mt-2">
                Choose a product from the left panel to load its stock movement history.
              </p>
            </div>
          ) : loading ? (
            <div className="px-6 py-20 text-center">
              <p className="text-sm text-gray-400">Loading movement records...</p>
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="text-lg font-bold text-white">No movements found</p>
              <p className="text-sm text-gray-400 mt-2">
                This product has no visible stock movement records yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-white/[0.02]">
                  <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Qty</th>
                    <th className="px-6 py-4 font-semibold">Reason</th>
                    <th className="px-6 py-4 font-semibold">Before</th>
                    <th className="px-6 py-4 font-semibold">After</th>
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {filteredMovements.map((movement, index) => {
                      const typeStyle = getTypeStyle(movement);

                      return (
                        <motion.tr
                          key={movement.id || `${movement.referenceCode}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-t border-white/6 hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] ${typeStyle.badge}`}
                            >
                              {typeStyle.icon}
                              {typeStyle.label}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-white font-bold">
                            {movement.quantity ?? movement.qty ?? '-'}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {movement.reason || movement.note || '-'}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {movement.beforeQuantity ?? movement.previousQuantity ?? '-'}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {movement.afterQuantity ?? movement.newQuantity ?? '-'}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {movement.referenceCode || '-'}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {formatDateTime(
                              movement.createdAt ||
                                movement.timestamp ||
                                movement.movementDate
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              {isAdmin ? (
                                <button
                                  onClick={() => handleDeleteMovement(movement.id)}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-300 transition-all hover:border-red-500/40 hover:bg-red-500/12 hover:text-red-200"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              ) : (
                                <span className="text-xs text-gray-500">Admin only</span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockMovementPanel;