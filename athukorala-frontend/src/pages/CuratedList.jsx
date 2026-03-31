import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Activity, LayoutGrid, Package, User, LogOut, Home, Sparkles, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const CuratedList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Authorized Guest"}');

  // --- 1. REGISTRY FETCH PROTOCOL ---
  const fetchCurated = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/curated/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error("Curated Registry Offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user.id) fetchCurated(); }, [user.id]);

  // --- 2. ADD TO CART PROTOCOL ---
  const handleAddToCartFromCurated = async (product) => {
    if (!user.id) {
      toast.error("Authentication Required");
      return;
    }

    const loadingToast = toast.loading("Syncing with Cart Registry...");
    try {
      const res = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          productId: product.id, 
          quantity: 1 
        }),
      });

      if (res.ok) {
        toast.success(`${product.name} Secured in Cart`, { 
          id: loadingToast,
          icon: '🛒',
          style: { borderRadius: '0px', background: '#050505', color: '#D4AF37', border: '1px solid #D4AF37' }
        });
      }
    } catch (err) {
      toast.error("Cart Connection Failed", { id: loadingToast });
    }
  };

  // --- 3. DE-CURATION PROTOCOL ---
  const handleRemove = async (id) => {
    const loadingToast = toast.loading("Executing De-curation...");
    try {
      const res = await fetch(`http://localhost:8080/api/curated/remove/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Asset Purged from Curated List", { id: loadingToast });
        fetchCurated();
      }
    } catch (err) {
      toast.error("System Error during removal", { id: loadingToast });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* GLOBAL PREMIUM SIDEBAR */}
      <motion.aside 
        initial={{ x: -280 }} animate={{ x: 0 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-12 relative z-50 hidden xl:flex h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2.5 bg-[#D4AF37] rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Activity className="text-black" size={22} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase opacity-60 mt-1">Industrial Registry</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <NavItem icon={<LayoutGrid size={18}/>} label="Market Registry" onClick={() => navigate('/customer-dashboard')} />
          <NavItem icon={<Package size={18}/>} label="Order History" onClick={() => navigate('/order-history')} />
          <NavItem icon={<Heart size={18}/>} label="Curated List" active={true} />
          <NavItem icon={<User size={18}/>} label="Account Config" onClick={() => navigate('/profile')} />
        </nav>

        <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 rounded-sm mb-4 text-left">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Registry Identity</p>
          <p className="text-xs font-bold uppercase truncate text-[#D4AF37]">{user.name}</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.3em] group text-left">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
        </button>
      </motion.aside>

      {/* MAIN INTERFACE */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

        <header className="mb-20 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Personal Archives</p>
            <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8]">
              Curated <br /> <span className="text-transparent stroke-text">List</span>
            </h1>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-40 text-[#D4AF37]"><Activity className="animate-spin" size={40} /></div>
        ) : (
          <motion.div 
            initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 text-left"
          >
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <div className="col-span-full py-40 text-center border border-dashed border-white/5 opacity-20">
                  <Heart size={48} className="mx-auto mb-4 text-gray-700" />
                  <p className="font-black uppercase tracking-widest text-xs">Archives Empty</p>
                </div>
              ) : items.map((item) => (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -10, borderColor: 'rgba(212, 175, 55, 0.3)' }}
                  className="bg-[#080808] border border-white/5 p-8 flex gap-8 group transition-all shadow-2xl relative overflow-hidden"
                >
                  <div className="w-28 h-28 bg-black border border-white/5 p-4 flex-shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                    <img src={item.product.imageUrl} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" alt="" />
                  </div>

                  <div className="flex-1 flex flex-col justify-center text-left">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:text-[#D4AF37] transition-colors">{item.product.name}</h3>
                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-4 opacity-60 italic">{item.product.category} Registry</p>
                    
                    {/* --- UPDATED PRICE LOGIC FOR PROMOTIONS --- */}
                    <div className="flex flex-col text-left">
                      {item.product.discountedPrice < item.product.price ? (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xl font-black text-[#D4AF37]">
                              LKR {item.product.discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-600 line-through font-mono mt-1">
                              {item.product.price.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-1">
                             PROMOTION APPLIED
                          </span>
                        </>
                      ) : (
                        <span className="font-mono text-xl font-black text-white">
                          LKR {item.product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-6 text-left">
                      <button 
                        onClick={() => handleAddToCartFromCurated(item.product)}
                        className="flex-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black py-4 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-lg"
                      >
                        <ShoppingCart size={14} className="group-hover/btn:animate-bounce" /> Add to Cart
                      </button>
                      <button 
                        onClick={() => handleRemove(item.id)} 
                        className="p-4 bg-white/5 hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all border border-white/5 active:scale-95"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent pointer-events-none" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-5 px-8 py-5 transition-all text-[11px] font-black tracking-[0.3em] uppercase group ${active ? 'bg-[#D4AF37] text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    <span className={active ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}>{icon}</span> {label}
  </button>
);

export default CuratedList;