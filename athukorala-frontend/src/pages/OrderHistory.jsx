import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, LogOut, Activity, Clock, MapPin, LayoutGrid, Heart, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Retrieve User Identity
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Authorized Guest"}');

  // SAFE DATE FORMATTER PROTOCOL
  const formatDate = (dateString) => {
    if (!dateString) return "DEPLOYMENT PENDING";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "INVALID FORMAT" : date.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        toast.error("Failed to retrieve transaction archives");
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchOrders();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-12 relative z-50 hidden xl:flex h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2.5 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Activity className="text-black" size={22} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase opacity-60">Industrial Registry</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-left">
          <NavItem icon={<LayoutGrid size={18}/>} label="Market Registry" onClick={() => navigate('/customer-dashboard')} />
          <NavItem icon={<Package size={18}/>} label="Order History" active={true} />
          <NavItem icon={<Heart size={18}/>} label="Curated List" onClick={() => navigate('/curated-list')} />
          <NavItem icon={<User size={18}/>} label="Account Config" onClick={() => navigate('/profile')} />
        </nav>

        <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-sm mb-4 text-left">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Registry Identity</p>
          <p className="text-xs font-bold uppercase truncate text-[#D4AF37]">{user.name}</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] group">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

        <header className="mb-20 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Transaction Archives</p>
            <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
              Order <br /> <span className="text-transparent stroke-text">History</span>
            </h1>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-40 text-[#D4AF37]"><Activity className="animate-spin" size={40} /></div>
        ) : (
          <motion.div 
            initial="initial" animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6 max-w-6xl"
          >
            {orders.length === 0 ? (
              <div className="py-40 text-center border border-dashed border-white/5 opacity-20">
                <Package size={48} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">No Records Found</p>
              </div>
            ) : orders.map((order) => (
              <OrderCard key={order.id} order={order} formatDate={formatDate} />
            ))}
          </motion.div>
        )}

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 transition-all text-[11px] font-black tracking-[0.3em] uppercase group ${active ? 'bg-[#D4AF37] text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <span className={active ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}>{icon}</span> {label}
  </button>
);

const OrderCard = ({ order, formatDate }) => (
  <motion.div 
    variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }}
    whileHover={{ x: 10, borderColor: 'rgba(212, 175, 55, 0.3)' }}
    className="group relative bg-[#080808] border border-white/5 p-10 transition-all flex flex-col md:flex-row justify-between items-center gap-12 shadow-2xl"
  >
    <div className="flex gap-12 items-center w-full md:w-auto">
      <div className="text-left">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Registry ID</p>
        <h3 className="text-3xl font-black font-mono tracking-tighter text-white">ATH-{order.id}</h3>
      </div>
      <div className={`px-6 py-3 border tracking-widest ${order.status === 'COMPLETED' ? 'border-green-500/30 text-green-500' : 'border-[#D4AF37]/30 text-[#D4AF37]'} bg-black/50 font-black text-[10px] uppercase flex items-center gap-3`}>
        <Clock size={14} /> {order.status || 'AUTHORIZED'}
      </div>
    </div>

    <div className="flex-1 text-left space-y-4 w-full">
      <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
        <Activity size={16} className="text-[#D4AF37]" /> Deployment: {formatDate(order.orderDate)}
      </div>
      <div className="flex items-center gap-3 text-gray-500 font-medium text-[10px] uppercase tracking-widest max-w-md">
        <MapPin size={16} className="shrink-0" /> {order.shippingAddress || 'Standard Delivery Protocol'}
      </div>
    </div>

    <div className="text-right w-full md:w-auto border-l border-white/5 pl-12">
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 text-right">Net Valuation</p>
      <p className="text-4xl font-black text-[#D4AF37] tracking-tighter font-mono text-right">LKR {order.totalAmount?.toLocaleString()}</p>
    </div>
  </motion.div>
);

export default OrderHistory;