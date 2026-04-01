import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Phone, Package, ShieldCheck, 
  Camera, Save, Trash2, ChevronRight, Clock, ArrowLeft, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({}); // Track validation errors
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePic: null
  });

  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    if (user.id) {
      // safely split name even if it's single word
      const nameParts = (user.name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePic: user.profilePic || null
      });

      // Fetch History from Registry
      fetch(`http://localhost:8080/api/orders/history/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]));
    }
  }, [user.id]);

  const validateForm = () => {
    let newErrors = {};
    // Industry Standard LK Phone Regex (Handles +94, 07x, etc.)
    const phoneRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "Mandatory Field";
    if (!formData.lastName.trim()) newErrors.lastName = "Mandatory Field";
    
    if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = "Invalid Protocol Format";
    }
    
    if (formData.address && formData.address.length < 10) {
        newErrors.address = "Address too brief (min 10)";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        toast.error("PROTOCOL REJECTED: CHECK DATA INTEGRITY");
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
    toast.success("AVATAR DELETED FROM CACHE");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loading = toast.loading("COMMITTING CHANGES TO MASTER REGISTRY...");

    const profilePayload = {
      ...user,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      phone: formData.phone,
      address: formData.address,
      profilePic: formData.profilePic
    };

    try {
      const res = await fetch(`http://localhost:8080/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload)
      });

      const updatedUserFromServer = await res.json();

      if (res.ok) {
        // Critical: Update Local Storage with the data returned from DB
        localStorage.setItem("user", JSON.stringify(updatedUserFromServer));
        
        toast.success("REGISTRY MODIFICATION SUCCESSFUL", { 
            id: loading,
            style: { border: '1px solid #D4AF37', background: '#000', color: '#D4AF37', fontSize: '10px', fontWeight: 'bold' } 
        });

        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(updatedUserFromServer.message || "REGISTRY DENIED", { id: loading });
      }
    } catch (err) {
      toast.error("SYSTEM LINK FAILURE", { id: loading });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 text-left selection:bg-[#D4AF37] selection:text-black">
      <Toaster position="top-right" />
      
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
          <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase text-left">Secure Identity Dashboard</p>
        </div>
        <h1 className="text-7xl font-black uppercase tracking-tighter text-left">
          Personal <span className="text-transparent stroke-text">Registry</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="lg:col-span-3 space-y-2">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Security Profile" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Transaction Logs" />
        </aside>

        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                
                <div className="flex items-center gap-8 bg-white/[0.02] border border-white/5 p-8 backdrop-blur-md">
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
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Avatar Protocol</h4>
                    <div className="flex gap-4">
                       <p className="text-[9px] text-gray-500 uppercase tracking-widest">Encryption layer active.</p>
                       {formData.profilePic && (
                         <button type="button" onClick={removeProfilePic} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                           <Trash2 size={10} /> Purge Image
                         </button>
                       )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                    <InputGroup label="First Name" value={formData.firstName} error={errors.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                    <InputGroup label="Last Name" value={formData.lastName} error={errors.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                    <InputGroup label="Contact Number" value={formData.phone} error={errors.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    
                    <div className="space-y-3 text-left opacity-50">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 block">Authentication Email</label>
                      <input disabled value={user.email || 'N/A'} className="w-full bg-white/[0.02] border border-white/5 p-5 text-xs font-bold text-gray-500 outline-none cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Registered address</label>
                        {errors.address && <span className="text-red-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10}/> {errors.address}</span>}
                    </div>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full bg-black border ${errors.address ? 'border-red-500' : 'border-white/10'} p-6 text-xs font-bold outline-none focus:border-[#D4AF37] h-32 transition-all`}
                      placeholder="ENTER FULL PHYSICAL ADDRESS..."
                    />
                  </div>

                  <button type="submit" className="bg-[#D4AF37] text-black px-12 py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-3">
                    <Save size={16}/> Commit Changes to Registry
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="orders" className="space-y-4">
                {/* Order logs remain the same logic */}
                {orders.length === 0 ? (
                    <div className="py-40 border border-white/5 border-dashed text-center">
                         <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">Registry Logs Empty</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white/[0.01] border border-white/5 p-8 flex justify-between items-center hover:border-[#D4AF37]/30 transition-all group">
                             <div className="flex items-center gap-8">
                                <div className="p-4 bg-black border border-white/10 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                                    <Package size={20}/>
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">TXID: #{order.id}</p>
                                    <h4 className="text-xl font-black text-white mt-1">LKR {Number(order.finalAmount || 0).toLocaleString()}</h4>
                                </div>
                             </div>
                             <ChevronRight className="text-gray-800 group-hover:text-[#D4AF37]" />
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

const InputGroup = ({ label, value, onChange, error }) => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</label>
        {error && <span className="text-red-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10}/> {error}</span>}
    </div>
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-black border ${error ? 'border-red-500' : 'border-white/10'} p-5 text-xs font-bold outline-none focus:border-[#D4AF37] transition-all`}
    />
  </div>
);

export default CustomerProfile;