import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Phone, Package, ShieldCheck, 
  Camera, Save, Trash2, ChevronRight, Clock, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePic: null
  });

  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    if (user.name) {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePic: user.profilePic || null
      });
    }

    // Attempting to fetch transaction history from backend
    if (user.id) {
        fetch(`http://localhost:8080/api/orders/history/${user.id}`)
          .then(res => res.json())
          .then(data => setOrders(Array.isArray(data) ? data : []))
          .catch(err => {
              console.error("History Registry Offline");
              setOrders([]); // Set to empty array on error to prevent crash
          });
    }
  }, [user.id, user.name, user.phone, user.address, user.profilePic]);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("VALIDATION ERROR: FULL NAME REQUIRED");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("VALIDATION ERROR: INVALID 10-DIGIT PHONE NUMBER");
      return false;
    }
    if (formData.address && formData.address.length < 10) {
      toast.error("VALIDATION ERROR: ADDRESS TOO SHORT (MIN 10 CHARS)");
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePic: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setFormData({ ...formData, profilePic: null });
    toast.success("AVATAR MARKED FOR REMOVAL");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loading = toast.loading("AUTHORIZING REGISTRY UPDATE...");

    const updatedUser = {
      ...user,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: formData.address,
      profilePic: formData.profilePic
    };

    try {
      const res = await fetch(`http://localhost:8080/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("CHANGES COMMITTED TO MASTER REGISTRY", { 
          id: loading,
          duration: 4000,
          style: {
            border: '1px solid #D4AF37',
            padding: '16px',
            color: '#D4AF37',
            background: '#050505',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.2em'
          }
        });

        setTimeout(() => {
            window.location.reload(); 
        }, 1500);

      } else {
        const errorData = await res.json();
        toast.error(`REGISTRY DENIED: ${errorData.message || 'Validation Failed'}`, { id: loading });
      }
    } catch (err) {
      toast.error("SYSTEM LINK FAILURE: BACKEND UNREACHABLE", { id: loading });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 text-left">
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#D4AF37] transition-all mb-10 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Dashboard
      </motion.button>

      <header className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase text-left">Account Security Dashboard</p>
        </div>
        <h1 className="text-7xl font-black uppercase tracking-tighter text-left">
          Personal <span className="text-transparent stroke-text">Registry</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="lg:col-span-3 space-y-2">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Security Profile" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Order History" />
        </aside>

        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                
                <div className="flex items-center gap-8 bg-white/[0.02] border border-white/5 p-8">
                  <div className="relative group w-32 h-32 bg-black border border-white/10 overflow-hidden shadow-2xl">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-800 font-black text-2xl uppercase italic">ATH</div>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={24} className="text-[#D4AF37]" />
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                  <div className="space-y-3 text-left">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-left">Avatar Protocol</h4>
                    <div className="flex gap-4">
                       <p className="text-[9px] text-gray-500 uppercase tracking-widest">Optional identity visualization.</p>
                       {formData.profilePic && (
                         <button 
                           type="button" 
                           onClick={removeProfilePic}
                           className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                         >
                           <Trash2 size={10} /> Purge Image
                         </button>
                       )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                    <InputGroup label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                    <InputGroup label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                    <InputGroup label="Contact Number" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    <div className="space-y-3 text-left">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 text-left block">Authentication Email</label>
                      <input disabled value={user.email || 'N/A'} className="w-full bg-white/[0.02] border border-white/5 p-5 text-xs font-bold text-gray-600 outline-none cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 text-left block">Registered Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-black border border-white/10 p-6 text-xs font-bold outline-none focus:border-[#D4AF37] h-32 transition-all"
                      placeholder="ENTER FULL PHYSICAL ADDRESS..."
                    />
                  </div>

                  <button type="submit" className="bg-[#D4AF37] text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl flex items-center gap-3">
                    <Save size={16}/> Commit Changes to Registry
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                {!Array.isArray(orders) || orders.length === 0 ? (
                  <div className="py-40 border border-white/5 border-dashed text-center">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">No Transaction History Recorded</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white/[0.01] border border-white/5 p-8 flex justify-between items-center hover:border-[#D4AF37]/30 transition-all group text-left">
                      <div className="flex items-center gap-8">
                        <div className="p-4 bg-black border border-white/10 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                          <Package size={20}/>
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-left">ID: #{order.id}</p>
                          {/* Defensive check for amount */}
                          <h4 className="text-xl font-black text-white mt-1 text-left">
                             LKR {Number(order.finalAmount || 0).toLocaleString()}
                          </h4>
                          <div className="flex items-center gap-4 mt-3 text-left">
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10">{order.orderStatus || 'PENDING'}</span>
                            <span className="text-[8px] font-bold text-gray-600 uppercase flex items-center gap-1">
                                <Clock size={10}/> 
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-800 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

const TabButton = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`w-full text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-[#D4AF37] text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {label}
  </button>
);

const InputGroup = ({ label, value, onChange }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 text-left block">{label}</label>
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border border-white/10 p-5 text-xs font-bold outline-none focus:border-[#D4AF37] transition-all"
    />
  </div>
);

export default CustomerProfile;