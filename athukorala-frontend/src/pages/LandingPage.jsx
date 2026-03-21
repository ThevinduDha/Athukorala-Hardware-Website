import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, Hammer, ShieldCheck, Zap, Factory, 
  Construction, Droplets, PaintBucket, MapPin, Phone, Clock, ExternalLink,
  Facebook, Instagram // Added these imports
} from 'lucide-react';
import Navbar from '../components/Navbar';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      <Navbar />

      {/* --- ELITE HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent z-10" />

        <motion.div style={{ y: y1 }} className="relative z-20 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <span className="text-[#D4AF37] font-mono tracking-[0.5em] text-xs uppercase">Premium Hardware Solutions</span>
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.5 }} className="text-7xl md:text-[10rem] font-black mb-4 tracking-tighter leading-none">
            ATHUKORALA
          </motion.h1>
          
          <motion.h2 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }} className="text-5xl md:text-8xl font-light italic text-[#D4AF37] tracking-tight mb-12">
            Traders (Pvt) Ltd.
          </motion.h2>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex flex-wrap justify-center gap-8">
            <button className="group relative px-12 py-5 border border-[#D4AF37] text-[#D4AF37] font-bold overflow-hidden transition-all hover:text-black">
              <span className="relative z-10 tracking-[0.3em] uppercase">Enter Portal</span>
              <div className="absolute inset-0 bg-[#D4AF37] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-[#D4AF37]/50">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto"></div>
        </motion.div>
      </section>

      {/* --- BRAND MARQUEE --- */}
      <div className="py-10 bg-[#0a0a0a] border-y border-white/5 overflow-hidden whitespace-nowrap">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="inline-block">
          <span className="text-4xl font-black text-white/10 mx-10 uppercase tracking-tighter">LANKATILES</span>
          <span className="text-4xl font-black text-[#D4AF37]/20 mx-10 uppercase tracking-tighter">NIPPON PAINT</span>
          <span className="text-4xl font-black text-white/10 mx-10 uppercase tracking-tighter">STANLEY</span>
          <span className="text-4xl font-black text-[#D4AF37]/20 mx-10 uppercase tracking-tighter">SIERRA CABLES</span>
          <span className="text-4xl font-black text-white/10 mx-10 uppercase tracking-tighter">ORANGE ELECTRIC</span>
          <span className="text-4xl font-black text-white/10 mx-10 uppercase tracking-tighter">LANKATILES</span>
          <span className="text-4xl font-black text-[#D4AF37]/20 mx-10 uppercase tracking-tighter">NIPPON PAINT</span>
        </motion.div>
      </div>

      {/* --- CATEGORIES --- */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CategoryCard icon={<Construction size={32}/>} title="Industrial Tools" count="1.2k+" delay={0.1} />
          <CategoryCard icon={<Zap size={32}/>} title="Electrical" count="850+" delay={0.2} />
          <CategoryCard icon={<Droplets size={32}/>} title="Plumbing" count="2.1k+" delay={0.3} />
          <CategoryCard icon={<PaintBucket size={32}/>} title="Paints & Coatings" count="400+" delay={0.4} />
        </div>
      </section>

      {/* --- CONTACT & HOURS --- */}
      <section className="py-32 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-6xl font-black mb-12 uppercase tracking-tighter leading-tight">Pitigala <br/><span className="text-[#D4AF37]">Headquarters</span></h2>
            <div className="space-y-10">
              <ContactLink icon={<MapPin/>} label="Location" val="New Town, Pitigala, Sri Lanka" />
              <ContactLink icon={<Phone/>} label="Hotline" val="0912 291 126" />
              <ContactLink icon={<ExternalLink/>} label="Directions" val="View on Google Maps" isLink />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[#D4AF37]/10"><Clock size={120}/></div>
            <h3 className="text-2xl font-bold uppercase tracking-widest mb-10 text-[#D4AF37]">Operation Hours</h3>
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400 font-light">{day}</span>
                  <span className="font-mono text-sm tracking-tighter">08:00 AM – 05:30 PM</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-3 bg-[#D4AF37]/10 p-4 rounded-lg border border-[#D4AF37]/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-black uppercase text-[#D4AF37]">Pitigala Branch is Currently Open</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FLOATING SOCIAL BAR (MOVED HERE) --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="fixed left-6 bottom-0 z-50 hidden lg:flex flex-col items-center gap-6 after:content-[''] after:w-[1px] after:h-24 after:bg-[#D4AF37]/30"
      >
        <a href="https://www.facebook.com/p/Athukorala-Traders-Pvt-Ltd-100050930484929/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all">
          <Facebook size={20} />
        </a>
        <a href="https://www.instagram.com/officialthenx03/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all">
          <Instagram size={20} />
        </a>
      </motion.div>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-gray-700 text-[10px] uppercase tracking-[1em] font-bold">
          Athukorala Traders (Pvt) Ltd • Engineering Excellence Since 1998
        </p>
      </footer>
    </div>
  );
};

// Sub-components
const CategoryCard = ({ icon, title, count, delay }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.8 }} whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.05)", borderColor: "rgba(212, 175, 55, 0.3)" }} className="p-10 border border-white/5 bg-[#0a0a0a] group cursor-pointer relative overflow-hidden transition-all">
    <div className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <p className="text-3xl font-black mb-2 tracking-tighter">{count}</p>
    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{title}</h3>
  </motion.div>
);

const ContactLink = ({ icon, label, val, isLink }) => (
  <div className="flex items-center gap-6 group cursor-pointer">
    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
      <p className={`text-xl font-medium ${isLink ? 'underline decoration-[#D4AF37]/30' : ''}`}>{val}</p>
    </div>
  </div>
);

export default LandingPage;