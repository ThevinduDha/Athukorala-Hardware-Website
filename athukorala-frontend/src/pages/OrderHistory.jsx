import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Package, User, Heart, LogOut, Activity, 
  Clock, MapPin, ChevronRight, X, LayoutGrid, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  
  // Retrieve User Identity
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Authorized Guest"}');

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
      
      {/* PREMIUM SLIDE BAR (MANUAL INTEGRATION) */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-12 relative z-50 hidden xl:flex h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2.5 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Activity className="text-black" size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase opacity-60">Industrial Registry</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-left">
          <NavItem 
            icon={<LayoutGrid size={18}/>} 
            label="Market Registry" 
            onClick={() => navigate('/customer-dashboard')} 
          />
          <NavItem 
            icon={<Package size={18}/>} 
            label="Order History" 
            active={true} 
          />
          <NavItem 
            icon={<Heart size={18}/>} 
            label="Curated List" 
            onClick={() => navigate('/curated-list')} // FIXED: Now navigates correctly
          />
          <NavItem 
            icon={<User size={18}/>} 
            label="Account Config" 
          />
        </nav>

        <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-sm mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Registry Identity</p>
          <p className="text-xs font-bold uppercase truncate text-[#D4AF37]">{user.name}</p>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Terminate Session
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

        <header className="mb-20">
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
              <OrderCard key={order.id} order={order} onOpenDetails={() => setSelectedOrder(order)} />
            ))}
          </motion.div>
        )}

        {/* ORDER DETAIL MODAL */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-[#0a0a0a] border border-white/10 z-[101] p-12 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
                
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Detailed Manifest</p>
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">ATH-{selectedOrder.id}</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-4 hover:bg-white/5 transition-all border border-white/10">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-12 border-y border-white/5 py-10 mb-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Protocol Status</p>
                    <p className="text-sm font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={16}/> {selectedOrder.status || 'AUTHORIZED'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Deployment Date</p>
                    <p className="text-sm font-black uppercase tracking-widest text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-16">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <Package size={14} className="text-[#D4AF37]" /> Asset Manifest
                    </p>
                    <div className="max-h-60 overflow-y-auto pr-6 space-y-4 custom-scrollbar">
                      {selectedOrder.orderItems?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-5 border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                            <p className="text-xs font-black uppercase tracking-widest">{item.productName} <span className="text-[#D4AF37] ml-2">x{item.quantity}</span></p>
                            <p className="text-sm font-mono font-black">LKR {item.price?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Grand Valuation</p>
                    <h3 className="text-5xl font-black text-[#D4AF37] tracking-tighter">LKR {selectedOrder.total?.toLocaleString()}</h3>
                  </div>
                  <button className="px-10 py-5 bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl">
                    Download Receipt
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; } .custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; }`}</style>
      </main>
    </div>
  );
};

// NavItem Component fixed with onClick
const NavItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-8 py-5 transition-all text-[11px] font-black tracking-[0.3em] uppercase group ${active ? 'bg-[#D4AF37] text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <span className={active ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}>{icon}</span> {label}
  </button>
);

const OrderCard = ({ order, onOpenDetails }) => (
  <motion.div 
    variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }}
    whileHover={{ x: 15 }}
    className="group relative bg-[#080808] border border-white/5 p-10 transition-all hover:border-[#D4AF37]/40 flex flex-col md:flex-row justify-between items-center gap-12 shadow-2xl"
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
    <div className="flex-1 text-left space-y-4">
      <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
        <Activity size={16} className="text-[#D4AF37]" /> Deployment: {new Date(order.createdAt).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-3 text-gray-500 font-medium text-[10px] uppercase tracking-widest max-w-sm">
        <MapPin size={16} /> {order.address || 'Standard Delivery Protocol'}
      </div>
    </div>
    <div className="text-right w-full md:w-auto border-l border-white/5 pl-12">
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Net Valuation</p>
      <p className="text-4xl font-black text-[#D4AF37] tracking-tighter mb-6 font-mono">LKR {order.total?.toLocaleString()}</p>
      <button onClick={onOpenDetails} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#D4AF37] transition-all ml-auto">
        View Details <ChevronRight size={18} />
      </button>
    </div>
  </motion.div>
);

export default OrderHistory;