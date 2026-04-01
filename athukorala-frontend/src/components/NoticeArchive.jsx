import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Edit3, ShieldCheck, Megaphone, Users, 
  AlertTriangle, X, Check, Calendar, ArrowRight, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const NoticeArchive = ({ refreshTrigger }) => {
  const [notices, setNotices] = useState([]);
  const [editingNotice, setEditingNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchRegistry = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/notices/all");
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) { 
      toast.error("Archive Link Offline"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistry(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL COMMAND: Permanently purge this notice?")) return;
    
    const loadingToast = toast.loading("Executing Purge Protocol...");
    try {
      const res = await fetch(`http://localhost:8080/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Entry Successfully Purged", { id: loadingToast });
        fetchRegistry();
      }
    } catch (err) { toast.error("Purge Failed", { id: loadingToast }); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // --- MANDATORY DATE VALIDATION ---
    if (!editingNotice.startDate || !editingNotice.expiryDate) {
        toast.error("VALIDATION ERROR: START AND END DATES ARE MANDATORY");
        return;
    }

    if (editingNotice.expiryDate < editingNotice.startDate) {
        toast.error("REGISTRY ERROR: EXPIRY CANNOT PRECEDE START");
        return;
    }

    const loadingToast = toast.loading("Authorizing Registry Updates...");
    try {
      const res = await fetch(`http://localhost:8080/api/notices/${editingNotice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNotice),
      });
      if (res.ok) {
        toast.success("Registry Protocol Updated", { id: loadingToast });
        setEditingNotice(null);
        fetchRegistry();
      }
    } catch (err) { toast.error("Update Refused", { id: loadingToast }); }
  };

  return (
    <div className="mt-20 space-y-8 text-left relative font-sans">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between border-b border-white/5 pb-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Master Broadcast Archive</h3>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Authorized CRUD Interface</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{notices.length} Recorded Entries</p>
        </div>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        {notices.map((notice) => (
          <motion.div 
            key={notice.id}
            whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.03)' }}
            className={`p-6 border border-white/5 bg-white/[0.01] flex items-center justify-between group transition-all relative overflow-hidden ${notice.urgent ? 'border-l-red-500 border-l-2' : 'hover:border-[#D4AF37]/30'}`}
          >
            <div className="flex items-center gap-8 relative z-10">
              <div className={`p-4 rounded-sm shadow-2xl ${notice.targetRole === 'CUSTOMER' ? 'bg-[#D4AF37] text-black' : 'bg-blue-600 text-white'}`}>
                {notice.targetRole === 'CUSTOMER' ? <Megaphone size={18}/> : <Users size={18}/>}
              </div>
              
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-black uppercase tracking-tighter text-white group-hover:text-[#D4AF37] transition-colors">{notice.title}</h4>
                  {notice.urgent && <span className="text-[7px] bg-red-500 text-white px-2 py-0.5 font-black uppercase">Urgent</span>}
                </div>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide max-w-md line-clamp-1 italic">"{notice.message}"</p>
                <div className="flex items-center gap-4 pt-2">
                   <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10}/> {notice.startDate}
                   </span>
                   <ArrowRight size={10} className="text-gray-700" />
                   <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10}/> {notice.expiryDate}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button onClick={() => setEditingNotice(notice)} className="p-3 bg-white/5 border border-white/5 text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all active:scale-90"><Edit3 size={16} /></button>
              <button onClick={() => handleDelete(notice.id)} className="p-3 bg-white/5 border border-white/5 text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-90"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {editingNotice && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingNotice(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#080808] border border-[#D4AF37]/30 p-12 w-full max-w-2xl relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Edit <span className="text-transparent stroke-text">Protocol</span></h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-2">Modify existing registry broadcast</p>
                </div>
                <button onClick={() => setEditingNotice(null)} className="text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest ml-1">Notice Header</label>
                  <input required className="w-full bg-black border border-white/10 p-5 text-xs font-black uppercase text-white outline-none focus:border-[#D4AF37]" value={editingNotice.title} onChange={(e) => setEditingNotice({...editingNotice, title: e.target.value.toUpperCase()})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest ml-1">Message Content</label>
                  <textarea required className="w-full bg-black border border-white/10 p-5 text-xs text-gray-400 outline-none focus:border-[#D4AF37] h-40 transition-all resize-none" value={editingNotice.message} onChange={(e) => setEditingNotice({...editingNotice, message: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Start Date <span className="text-red-500">*</span></label>
                    <input required type="date" min={today} value={editingNotice.startDate} onChange={(e) => setEditingNotice({...editingNotice, startDate: e.target.value})} className="w-full bg-black border border-white/10 p-4 text-[10px] font-bold text-white outline-none industrial-date-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">End Date <span className="text-red-500">*</span></label>
                    <input required type="date" min={editingNotice.startDate || today} value={editingNotice.expiryDate} onChange={(e) => setEditingNotice({...editingNotice, expiryDate: e.target.value})} className="w-full bg-black border border-white/10 p-4 text-[10px] font-bold text-white outline-none industrial-date-input" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-[#D4AF37] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl">
                    <Check size={18}/> Authorize Changes
                  </button>
                  <button type="button" onClick={() => setEditingNotice(null)} className="px-10 bg-white/5 border border-white/10 text-gray-500 py-5 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all">Abort</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }
        .industrial-date-input::-webkit-calendar-picker-indicator {
            filter: invert(70%) sepia(50%) saturate(500%) hue-rotate(10deg) brightness(100%) contrast(100%);
            cursor: pointer;
            padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default NoticeArchive;