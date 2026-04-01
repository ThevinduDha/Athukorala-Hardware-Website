import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Send, Sparkles, AlertTriangle, Eye, Clock, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PromotionNoticeManager = () => {
  const today = new Date().toISOString().split('T')[0];
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    startDate: today,
    expiryDate: "",
    isUrgent: false
  });
  const [showPreview, setShowPreview] = useState(false);

  const validateProtocol = () => {
    if (!formData.title || formData.title.length < 5) {
      toast.error("VALIDATION ERROR: Header too short (Min 5 chars)");
      return false;
    }
    if (!formData.message || formData.message.length < 10) {
      toast.error("VALIDATION ERROR: Details too short (Min 10 chars)");
      return false;
    }
    if (!formData.expiryDate) {
      toast.error("VALIDATION ERROR: Expiry Date Required");
      return false;
    }
    if (new Date(formData.expiryDate) < new Date(formData.startDate)) {
      toast.error("DATE ERROR: Expiry cannot precede Start Date");
      return false;
    }
    return true;
  };

  const handleBroadcast = async (e) => {
    e.preventDefault(); 
    if (!validateProtocol() || isDeploying) return;
    
    setIsDeploying(true);
    const loading = toast.loading("Deploying Strategic Promotion to Registry...");

    try {
      const res = await fetch("http://localhost:8080/api/notices/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: formData.title,
          message: formData.message,
          startDate: formData.startDate,
          expiryDate: formData.expiryDate,
          urgent: formData.isUrgent, 
          targetRole: "CUSTOMER",
          active: true 
        })
      });

      if (res.ok) {
        // SUCCESS ALERT PROTOCOL
        toast.success("PROMOTION BROADCAST LIVE", { 
            id: loading,
            style: {
                border: '1px solid #D4AF37',
                padding: '16px',
                color: '#D4AF37',
                background: '#000',
                fontSize: '10px',
                fontWeight: '900',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
            },
            iconTheme: { primary: '#D4AF37', secondary: '#000' }
        });

        // RESET FORM DATA
        setFormData({ title: "", message: "", startDate: today, expiryDate: "", isUrgent: false });
        setShowPreview(false);
      } else {
        toast.error("Handshake Refused by Backend", { id: loading });
      }
    } catch (err) { 
      toast.error("System Link Offline: Check Proxy", { id: loading }); 
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-[#080808] border border-white/5 p-8 shadow-2xl relative overflow-hidden text-left">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37] text-black rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Megaphone size={18}/>
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Promotion Command</h3>
        </div>
        <button 
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${showPreview ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
        >
          <Eye size={14} /> {showPreview ? 'Hide Preview' : 'Live Preview'}
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Notice Designation</label>
          <input 
            type="text"
            placeholder="PROMOTION TITLE (e.g., SEASONAL REDUCTION)"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})}
            className="w-full bg-black border border-white/10 p-4 text-[10px] font-black tracking-widest text-white outline-none focus:border-[#D4AF37]/50 transition-all text-left"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Operational Instructions</label>
          <textarea 
            placeholder="ENTER STRATEGIC MESSAGE..."
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-black border border-white/10 p-4 text-[11px] font-medium tracking-wide text-gray-400 outline-none focus:border-[#D4AF37]/50 h-28 transition-all text-left"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group/date">
             <span className="absolute left-12 top-2 text-[7px] font-black text-[#D4AF37] uppercase tracking-widest z-10">Start Deployment</span>
             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] z-10" size={14} />
             <input 
               type="date"
               min={today}
               value={formData.startDate}
               onChange={(e) => setFormData({...formData, startDate: e.target.value})}
               className="premium-date-input w-full bg-black border border-white/10 p-4 pt-7 pl-12 text-[10px] font-bold text-white outline-none focus:border-[#D4AF37]/50 uppercase transition-all"
             />
          </div>

          <div className="relative group/date">
             <span className="absolute left-12 top-2 text-[7px] font-black text-[#D4AF37] uppercase tracking-widest z-10">Expiry Handshake</span>
             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] z-10" size={14} />
             <input 
               type="date"
               min={formData.startDate}
               value={formData.expiryDate}
               onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
               className="premium-date-input w-full bg-black border border-white/10 p-4 pt-7 pl-12 text-[10px] font-bold text-white outline-none focus:border-[#D4AF37]/50 uppercase transition-all"
             />
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setFormData({...formData, isUrgent: !formData.isUrgent})}
          className={`flex items-center justify-center gap-3 border py-4 transition-all duration-500 text-[9px] font-black uppercase tracking-widest relative overflow-hidden ${
            formData.isUrgent 
              ? 'bg-red-600/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
              : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
          }`}
        >
          {formData.isUrgent && <motion.div layoutId="pulse" className="absolute inset-0 bg-red-500/5 animate-pulse" />}
          <AlertTriangle size={14} className={formData.isUrgent ? "animate-bounce" : ""} /> 
          {formData.isUrgent ? "Emergency Priority Active" : "Normal Priority"}
        </button>

        <AnimatePresence>
          {showPreview && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="pt-6 border-t border-white/5">
              <div className={`border p-6 relative overflow-hidden transition-colors duration-700 ${formData.isUrgent ? 'bg-red-950/10 border-red-900/40' : 'bg-[#D4AF37]/5 border-[#D4AF37]/20'}`}>
                <div className="flex items-center gap-4 relative z-10 text-left">
                   <div className={`p-2 rounded-sm ${formData.isUrgent ? 'bg-red-600 text-white' : 'bg-[#D4AF37] text-black'}`}>
                     {formData.isUrgent ? <AlertTriangle size={14}/> : <Sparkles size={14}/>}
                   </div>
                   <div>
                      <h4 className="text-sm font-black uppercase text-white tracking-tighter text-left">{formData.title || 'TITLE PREVIEW'}</h4>
                      <p className="text-[10px] text-gray-400 italic text-left">"{formData.message || 'Announcement message content preview...'}"</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleBroadcast}
          disabled={isDeploying}
          className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
            isDeploying ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-white'
          }`}
        >
          {isDeploying ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {isDeploying ? "Uploading to Registry..." : "Deploy to Registry"}
        </button>
      </div>

      <style>{`
        .premium-date-input::-webkit-calendar-picker-indicator {
          filter: invert(72%) sepia(50%) saturate(450%) hue-rotate(10deg) brightness(90%) contrast(90%);
          cursor: pointer; opacity: 0.6; transition: all 0.3s ease; margin-right: 5px;
        }
        .premium-date-input::-webkit-calendar-picker-indicator:hover { opacity: 1; transform: scale(1.1); }
        .premium-date-input { min-height: 60px; display: flex; align-items: center; }
      `}</style>
    </div>
  );
};

export default PromotionNoticeManager;