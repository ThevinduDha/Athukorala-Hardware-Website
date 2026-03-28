import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Clock, ChevronRight, Sparkles, Calendar } from 'lucide-react';

const CustomerAnnouncement = ({ onSecureOffer }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/customer")
      .then(res => res.json())
      .then(data => {
        // SCHEDULING FILTER: Only show notices active for TODAY
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const activeToday = (Array.isArray(data) ? data : []).filter(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.expiryDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          
          return now >= start && now <= end;
        });

        setAnnouncements(activeToday);
      })
      .catch(err => console.error("Announcement stream offline"));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-12 relative overflow-hidden bg-black border border-[#D4AF37]/30 p-8 backdrop-blur-3xl group text-left shadow-2xl"
      >
        <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
          <div className="flex items-start gap-6 text-left">
            <div className="p-4 bg-[#D4AF37] text-black rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] shrink-0">
              <Sparkles size={24} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-4 mb-3 text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] text-left">Active Promotion Protocol</span>
                {current.isUrgent && (
                  <span className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                    High Priority
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white text-left">{current.title}</h2>
              
              {/* SCHEDULING BADGE */}
              <div className="flex items-center gap-4 mt-2 mb-4 text-left">
                 <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-left">
                    <Calendar size={12}/> Effective: {new Date(current.startDate).toLocaleDateString()}
                 </div>
                 <div className="w-1 h-1 rounded-full bg-white/20 text-left" />
                 <div className="flex items-center gap-2 text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest text-left">
                    <Clock size={12}/> Deployment Ends: {new Date(current.expiryDate).toLocaleDateString()}
                 </div>
              </div>

              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed italic border-l-2 border-[#D4AF37]/20 pl-4 text-left">
                "{current.message}"
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-5 min-w-[220px] text-left">
            {/* UPDATED: Added onSecureOffer click handler */}
            <button 
              onClick={onSecureOffer}
              className="w-full px-8 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group/btn"
            >
              Secure Offer <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {announcements.length > 1 && (
          <div className="flex gap-3 mt-8 text-left">
            {announcements.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-12 bg-[#D4AF37]' : 'w-3 bg-white/10 hover:bg-white/30'}`} />
            ))}
          </div>
        )}
      </motion.div>
      <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AnimatePresence>
  );
};

export default CustomerAnnouncement;