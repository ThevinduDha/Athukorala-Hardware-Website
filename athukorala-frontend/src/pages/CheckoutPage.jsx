import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Lock, CreditCard, ArrowLeft, 
  CheckCircle2, AlertCircle, Home, Download, Share2, Package 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // NEW: Success state
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderId, setOrderId] = useState(""); // NEW: To store generated order ID

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Calculate total from cart data passed via navigation or localStorage
  useEffect(() => {
    const savedTotal = localStorage.getItem("lastCartTotal") || "0";
    setTotalAmount(parseFloat(savedTotal));
  }, []);

  // --- PREMIUM FORMATTING LOGIC ---
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length > 0 ? parts.join(' ') : v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setFormData({ ...formData, [name]: formatCardNumber(value) });
    } else if (name === 'expiry') {
      let v = value.replace(/\D/g, '');
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
      setFormData({ ...formData, [name]: v.substring(0, 5) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- SMART SRI LANKAN PHONE VALIDATION ---
  const isPhoneValid = (num) => {
    const cleanNum = num.trim();
    if (cleanNum.startsWith("+94")) return cleanNum.length === 12; // +94771234567
    if (cleanNum.startsWith("94")) return cleanNum.length === 11;  // 94771234567
    if (cleanNum.startsWith("07")) return cleanNum.length === 10;  // 0771234567
    return false;
  };

  const isFormValid = () => {
    return (
      formData.address.length > 10 &&
      isPhoneValid(formData.phone) &&
      formData.cardNumber.replace(/\s/g, '').length === 16 &&
      formData.expiry.length === 5 &&
      formData.cvv.length === 3
    );
  };

  const processOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const loadingToast = toast.loading("ENCRYPTING TRANSACTION PAYLOAD...");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const response = await fetch("http://localhost:8080/api/orders/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              userId: user.id,
              address: formData.address,
              phone: formData.phone,
              total: totalAmount
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setOrderId(data.id || `ATH-${Math.floor(Math.random()*9000)}`);
          toast.success("TRANSACTION VERIFIED", { id: loadingToast });
          
          // Trigger Success View instead of immediate navigation
          setIsSuccess(true); 
        } else {
          toast.error("INVENTORY SYNC FAILURE: STOCK DEPLETED", { id: loadingToast });
        }
    } catch (err) {
        toast.error("GATEWAY TIMEOUT: CHECK BACKEND", { id: loadingToast });
    } finally {
        setIsProcessing(false);
    }
  };

  // --- NEW: ORDER CONFIRMATION VIEW ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8 font-sans overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white/[0.02] border border-white/5 p-12 backdrop-blur-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <motion.div 
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(212,175,55,0.3)]"
              >
                <CheckCircle2 size={48} className="text-black" />
              </motion.div>
            </div>
            <div className="space-y-3">
              <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase">Transaction Authenticated</p>
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Order Confirmed</h1>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol ID</span>
                <span className="text-xs font-mono font-black text-white">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Settlement Amount</span>
                <span className="text-sm font-mono font-black text-[#D4AF37]">LKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logistics Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Awaiting Dispatch</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6">
              <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"><Download size={14} /> Invoice</button>
              <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"><Share2 size={14} /> Receipt</button>
            </div>
            <button 
              onClick={() => navigate('/customer-dashboard')}
              className="w-full bg-[#D4AF37] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.1)] flex items-center justify-center gap-3"
            >
              <Home size={16} /> Return to Catalog
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans selection:bg-[#D4AF37] selection:text-black">
      <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-all mb-12 uppercase text-[10px] font-bold tracking-widest">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> BACK TO REGISTRY
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* LEFT: LOGISTICS & DATA ENTRY (7 COLS) */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-[#D4AF37]" size={14} />
              <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Security Level: AES-256</p>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Checkout <br/><span className="text-transparent stroke-text">Protocol</span></h1>
          </header>

          <form id="checkout-form" onSubmit={processOrder} className="space-y-12">
            <section>
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-500 mb-8 flex items-center gap-4">
                01. Shipping Logistics <div className="h-[1px] flex-1 bg-white/5"></div>
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <div className="relative text-left">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-4">Final Destination (Full Address)</label>
                  <textarea 
                    required name="address" onChange={handleInputChange}
                    className="w-full bg-white/[0.02] border border-white/10 p-6 focus:border-[#D4AF37]/50 outline-none text-xs uppercase transition-all h-32 resize-none"
                    placeholder="ENTER WAREHOUSE OR SITE ADDRESS..."
                  />
                  {formData.address.length > 0 && formData.address.length <= 10 && (
                    <p className="text-red-500 text-[8px] mt-2 font-bold tracking-widest uppercase text-left">Error: Address too short for logistics</p>
                  )}
                </div>
                <div className="relative text-left">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-4">Contact Payload (Phone)</label>
                  <input 
                    required type="tel" name="phone" onChange={handleInputChange}
                    className={`w-full bg-white/[0.02] border p-6 outline-none text-xs tracking-[0.3em] uppercase transition-all ${formData.phone && !isPhoneValid(formData.phone) ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]/50'}`}
                    placeholder="07XXXXXXXX OR +94XXXXXXXXX"
                  />
                  {formData.phone && !isPhoneValid(formData.phone) && (
                    <p className="text-red-500 text-[8px] mt-2 font-bold tracking-widest uppercase italic text-left">Invalid Sri Lankan Format detected</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-500 mb-8 flex items-center gap-4">
                02. Payment Encryption <div className="h-[1px] flex-1 bg-white/5"></div>
              </h3>
              <div className="space-y-8 bg-white/[0.01] border border-white/5 p-10">
                <div className="relative text-left">
                  <CreditCard className="absolute right-6 top-[54px] text-gray-700" size={20} />
                  <label className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-4">Card Identifier</label>
                  <input 
                    required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange}
                    className="w-full bg-black border border-white/10 p-6 focus:border-[#D4AF37]/50 outline-none text-lg font-mono tracking-[0.3em]"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8 text-left">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-4">Expiry Date</label>
                    <input required name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className="w-full bg-black border border-white/10 p-6 focus:border-[#D4AF37]/50 outline-none text-xs font-mono" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-4">CVV Verification</label>
                    <input required name="cvv" type="password" maxLength="3" onChange={handleInputChange} placeholder="***" className="w-full bg-black border border-white/10 p-6 focus:border-[#D4AF37]/50 outline-none text-xs font-mono" />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </motion.div>

        {/* RIGHT: FLOATING SUMMARY (5 COLS) */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <div className="sticky top-20 bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-12 backdrop-blur-xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
            
            <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37] mb-12">Authorization Summary</h3>
            
            <div className="space-y-6 mb-12 border-b border-[#D4AF37]/10 pb-12">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Network Latency</span>
                <span className="text-[#D4AF37]">12MS</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>GateWay Status</span>
                <span className="text-green-500 font-black uppercase">Encrypted</span>
              </div>
            </div>

            <div className="mb-12">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Final Authorized Amount</p>
               <h2 className="text-5xl font-black text-white tracking-tighter">LKR {totalAmount.toLocaleString()}</h2>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={isProcessing || !isFormValid()}
              className={`w-full py-6 font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 transition-all ${isFormValid() ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}
            >
              {isProcessing ? "PROCESSING SECURE LINK..." : <><ShieldCheck size={18} /> AUTHORIZE PAYMENT</>}
            </button>

            {!isFormValid() && (
              <div className="mt-6 flex items-center gap-3 text-red-500/50 justify-center">
                <AlertCircle size={12} />
                <span className="text-[8px] font-bold uppercase tracking-widest text-center">Incomplete Data: Please verify all fields</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default CheckoutPage;