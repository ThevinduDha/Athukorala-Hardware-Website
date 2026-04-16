import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LowStockPanel from '../components/LowStockPanel';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const fetchAllOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders/all");
      if (res.ok) {
        const data = await res.json();
        setOrders(
          data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        );
      }
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    const loading = toast.loading(`Updating: ${newStatus}...`);

    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/update-status/${id}?status=${newStatus}`,
        { method: 'PATCH' }
      );

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(prev =>
          prev.map(o =>
            o.id === id ? { ...o, status: updatedOrder.status } : o
          )
        );
        toast.success(`Updated to ${newStatus}`, { id: loading });
      } else {
        toast.error("Update failed", { id: loading });
      }
    } catch {
      toast.error("Server error", { id: loading });
    }
  };

  const stats = useMemo(() => ({
    totalValue: orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
    pending: orders.filter(o => o.status === 'PENDING').length,
    approved: orders.filter(o => o.status === 'APPROVED').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    rejected: orders.filter(o => o.status === 'REJECTED').length
  }), [orders]);

  const filteredOrders = orders.filter(
    o => filter === 'ALL' || o.status === filter
  );

  const statusColor = (status) => {
    if (status === 'PENDING') return 'bg-amber-400';
    if (status === 'APPROVED') return 'bg-blue-400';
    if (status === 'COMPLETED') return 'bg-green-400';
    if (status === 'REJECTED') return 'bg-red-400';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-8">

      {/* LOW STOCK PANEL */}
      <LowStockPanel />

      {/* HEADER */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
              Logistics Control
            </p>
            <h2 className="text-3xl font-black text-white">
              Global Orders
            </h2>
          </div>

          <div className="flex gap-6">
            <StatCard title="Total Value" value={`LKR ${stats.totalValue.toLocaleString()}`} />
            <StatCard title="Pending" value={stats.pending} />
            <StatCard title="Approved" value={stats.approved} />
            
            <StatCard title="Rejected" value={stats.rejected} />
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition 
              ${filter === s 
                ? 'bg-[#D4AF37] text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex flex-col lg:flex-row justify-between gap-6 hover:bg-white/[0.06] transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Package className="text-[#D4AF37]" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    ORDER #{order.id}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex-1">
                <p className="text-xs text-gray-400">Destination</p>
                <p className="text-sm text-white truncate">
                  {order.shippingAddress}
                </p>
              </div>

              {/* PRICE */}
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-lg font-bold text-white">
                  LKR {order.totalAmount.toLocaleString()}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${statusColor(order.status)}`}></span>
                <span className="text-sm text-white">{order.status}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                {/* APPROVE */}
                <button
                  onClick={() => updateStatus(order.id, 'APPROVED')}
                  disabled={order.status !== 'PENDING'}
                  className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition disabled:opacity-20"
                >
                  ✔
                </button>

                {/* REJECT */}
                <button
                  onClick={() => updateStatus(order.id, 'REJECTED')}
                  disabled={order.status !== 'PENDING'}
                  className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition disabled:opacity-20"
                >
                  ✖
                </button>


              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
    <p className="text-xs text-gray-400">{title}</p>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

export default AdminOrders;