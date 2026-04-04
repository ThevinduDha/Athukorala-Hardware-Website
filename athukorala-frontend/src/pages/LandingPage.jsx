import React, { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Construction,
  Droplets,
  PaintBucket,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  User,
  Lock,
  ArrowRight,
  Star,
  Sparkles,
  Factory,
  Truck,
  CheckCircle2,
  Megaphone,
  Timer,
  CalendarDays,
  BadgePercent,
  Gift,
  Image as ImageIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const { scrollY } = useScroll();

  const yHero = useTransform(scrollY, [0, 500], [0, 70]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.78]);

  const [promoAnnouncements, setPromoAnnouncements] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [promoIndex, setPromoIndex] = useState(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 8) + 4,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 8 + 8
      })),
    []
  );

  const sectionReveal = {
    hidden: { opacity: 0, y: 45 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const softReveal = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/notices/customer');
        const data = await res.json();

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const filtered = (Array.isArray(data) ? data : [])
          .filter((item) => {
            const end = new Date(item.expiryDate);
            end.setHours(0, 0, 0, 0);
            return now <= end;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setPromoAnnouncements(filtered);
      } catch (error) {
        console.error('Announcement fetch failed', error);
        setPromoAnnouncements([]);
      }
    };

    const fetchPromotions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/promotions/all');
        const data = await res.json();
        setActivePromotions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Promotions fetch failed', error);
        setActivePromotions([]);
      }
    };

    fetchAnnouncements();
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promoAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoAnnouncements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promoAnnouncements.length]);

  const currentAnnouncement =
    promoAnnouncements.length > 0 ? promoAnnouncements[promoIndex] : null;

  const isUpcoming =
    currentAnnouncement && new Date(currentAnnouncement.startDate) > new Date();

  const activePromoCount = activePromotions.length;
  const liveNoticeCount = promoAnnouncements.length;

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden z-10">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.24 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImg})`,
            y: yHero,
            opacity: opacityHero
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/68 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />

        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-[320px] h-[320px] bg-[#D4AF37]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-[340px] h-[340px] bg-yellow-500/10 rounded-full blur-[130px]"
        />

        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-[#D4AF37]/20"
              style={{
                width: particle.size,
                height: particle.size,
                top: particle.top,
                left: particle.left
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.7, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: yHero }}
          className="relative z-20 max-w-7xl mx-auto px-6 pt-16 md:pt-20 lg:pt-24"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mb-4"
            >
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.38em] text-gray-500 mb-3">
                Industrial Supply • Electrical • Plumbing • Coatings
              </p>

              <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[7rem] xl:text-[7.5rem] font-black tracking-[-0.07em] leading-none text-white">
                ATHUKORALA
              </h1>

              <div className="flex items-center justify-center gap-4 mt-1">
                <div className="hidden md:block h-[1px] w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <h2 className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[4.4rem] font-light italic text-[#D4AF37] tracking-tight">
                  TRADERS
                </h2>
                <div className="hidden md:block h-[1px] w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="max-w-[1380px] mx-auto"
            >
              <HeroPromotionShowcase
                currentAnnouncement={currentAnnouncement}
                promoAnnouncements={promoAnnouncements}
                promoIndex={promoIndex}
                setPromoIndex={setPromoIndex}
                isUpcoming={isUpcoming}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* CLEAN LOWER HERO CONTENT */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative z-20 max-w-7xl mx-auto px-6 pt-10 md:pt-12 pb-16 md:pb-20"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.p
              variants={softReveal}
              className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-8"
            >
              Industrial-grade tools, electrical supplies, plumbing solutions, and premium
              coatings — delivered with trust, quality, and modern service excellence.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-7"
            >
              <PremiumBadge icon={<ShieldCheck size={16} />} text="Trusted Quality" />
              <PremiumBadge icon={<Truck size={16} />} text="Fast Supply" />
              <PremiumBadge icon={<Factory size={16} />} text="Industrial Grade" />
              <PremiumBadge icon={<Sparkles size={16} />} text="Premium Experience" />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <MiniChip
                icon={<Megaphone size={14} />}
                text={`${liveNoticeCount} Live Announcements`}
              />
              <MiniChip
                icon={<BadgePercent size={14} />}
                text={`${activePromoCount} Discount Campaigns`}
              />
              <MiniChip
                icon={<Gift size={14} />}
                text="Special Customer Deals"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <motion.div variants={softReveal}>
                <Link to="/auth?mode=admin">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.18)' }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative px-8 sm:px-10 py-5 rounded-2xl border border-[#D4AF37] text-[#D4AF37] font-bold overflow-hidden hover:text-black min-w-[250px] bg-black/30 backdrop-blur-xl"
                  >
                    <span className="relative z-10 tracking-[0.24em] uppercase flex items-center justify-center gap-3 text-sm">
                      <Lock size={18} />
                      Industrial Access
                    </span>
                    <div className="absolute inset-0 bg-[#D4AF37] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div variants={softReveal}>
                <Link to="/auth?mode=customer">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative px-8 sm:px-10 py-5 rounded-2xl border border-white/10 text-white font-bold overflow-hidden min-w-[250px] bg-white/5 backdrop-blur-xl"
                  >
                    <span className="relative z-10 tracking-[0.24em] uppercase flex items-center justify-center gap-3 text-sm">
                      <User size={18} />
                      Client Portal
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PREMIUM TRANSITION */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.8 }}
        className="relative z-30"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </motion.section>

      {/* BRANDS */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-30 py-10 mt-8 bg-[#0a0a0a] border-y border-white/5 overflow-hidden whitespace-nowrap"
      >
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          {[
            'LANKATILES',
            'NIPPON PAINT',
            'STANLEY',
            'SIERRA CABLES',
            'ORANGE ELECTRIC',
            'LANKATILES',
            'NIPPON PAINT',
            'STANLEY'
          ].map((brand, index) => (
            <span
              key={index}
              className={`text-4xl font-black mx-10 uppercase tracking-tighter ${
                index % 2 === 0 ? 'text-white/10' : 'text-[#D4AF37]/20'
              }`}
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </motion.section>

      {/* WHY CHOOSE US */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="relative z-20 py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={softReveal} className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Built for Reliability
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            From home projects to industrial operations, we supply dependable materials
            with consistent quality and service.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon={<ShieldCheck size={28} />}
            title="Trusted Products"
            text="We provide quality materials and dependable brands for long-term performance."
          />
          <FeatureCard
            icon={<Truck size={28} />}
            title="Fast Service"
            text="Quick response, smooth purchasing experience, and customer-focused support."
          />
          <FeatureCard
            icon={<Star size={28} />}
            title="Premium Experience"
            text="A modern, premium service approach with stronger visual identity and trust."
          />
        </motion.div>
      </motion.section>

      {/* CATEGORIES */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="relative z-20 py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={softReveal} className="mb-14 text-center">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Our Categories
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Core Product Lines
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          <CategoryCard icon={<Construction size={32} />} title="Industrial Tools" count="1.2k+" />
          <CategoryCard icon={<Zap size={32} />} title="Electrical" count="850+" />
          <CategoryCard icon={<Droplets size={32} />} title="Plumbing" count="2.1k+" />
          <CategoryCard icon={<PaintBucket size={32} />} title="Paints & Coatings" count="400+" />
        </motion.div>
      </motion.section>

      {/* LOCATION */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="relative z-20 py-28 bg-[#050505] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.08),transparent_30%)]" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
          <motion.div
            variants={softReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
              Visit Us
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter leading-tight">
              Pitigala
              <br />
              <span className="text-[#D4AF37]">Headquarters</span>
            </h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-8"
            >
              <ContactLink icon={<MapPin />} label="Location" val="New Town, Pitigala, Sri Lanka" />
              <ContactLink icon={<Phone />} label="Hotline" val="0912 291 126" />
              <ContactLink icon={<ExternalLink />} label="Directions" val="View on Google Maps" isLink />
            </motion.div>

            <motion.div
              variants={softReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="mt-10 p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-start gap-4"
            >
              <CheckCircle2 className="text-[#D4AF37] mt-1" size={18} />
              <p className="text-sm text-gray-300 leading-relaxed">
                Trusted by customers looking for strong materials, dependable service,
                and premium product sourcing for real projects.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={softReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[30px] backdrop-blur-xl relative overflow-hidden group shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
          >
            <div className="absolute top-0 right-0 p-8 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors">
              <Clock size={120} />
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-8 text-[#D4AF37]">
              Operation Hours
            </h3>

            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className="flex justify-between items-center border-b border-white/5 pb-3"
                >
                  <span className="text-gray-400 font-light">{day}</span>
                  <span className="font-mono text-sm tracking-tight">
                    08:00 AM – 05:30 PM
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 flex items-center gap-3 bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/20"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-[#D4AF37] tracking-[0.15em]">
                Pitigala Branch is Currently Open
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-20 py-24 px-6"
      >
        <div className="max-w-6xl mx-auto text-center rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl px-6 md:px-12 py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_45%)]" />
          <p className="relative z-10 text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Start Now
          </p>
          <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
            Enter The Premium
            <span className="text-[#D4AF37]"> Hardware Experience</span>
          </h2>
          <p className="relative z-10 text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Access the customer portal or secure industrial portal to explore products,
            services, and premium business operations.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 mt-10 flex flex-wrap justify-center gap-5"
          >
            <motion.div variants={softReveal}>
              <Link to="/auth?mode=customer">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em]"
                >
                  Client Portal
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={softReveal}>
              <Link to="/auth?mode=admin">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl border border-white/15 bg-white/5 text-white font-black uppercase tracking-[0.2em]"
                >
                  Industrial Access
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="fixed left-6 bottom-0 z-50 hidden lg:flex flex-col items-center gap-6 after:content-[''] after:w-[1px] after:h-24 after:bg-[#D4AF37]/30"
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all"
        >
          <Facebook size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all"
        >
          <Instagram size={20} />
        </a>
      </motion.div>

      <footer className="py-16 border-t border-white/5 text-center">
        <p className="text-gray-700 text-[10px] uppercase tracking-[0.7em] font-bold px-4">
          Athukorala Traders (Pvt) Ltd • Engineering Excellence Since 1998
        </p>
      </footer>
    </div>
  );
};

const HeroPromotionShowcase = ({
  currentAnnouncement,
  promoAnnouncements,
  promoIndex,
  setPromoIndex,
  isUpcoming
}) => {
  const imageUrl = getAnnouncementImage(currentAnnouncement);

  if (!currentAnnouncement) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.10),transparent_35%)]" />
        <motion.div
          animate={{ x: ['-100%', '120%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.28em] mb-4">
              <Megaphone size={13} />
              Promotion Space Ready
            </div>

            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              Your discount banner
              <span className="text-[#D4AF37]"> can appear here beautifully</span>
            </h3>

            <p className="text-sm md:text-base text-gray-400 mt-4 max-w-2xl leading-relaxed">
              When you add a customer announcement, this section can show title, message,
              dates, and image in a premium hero layout.
            </p>
          </div>

          <div className="w-full lg:w-[320px] h-[220px] rounded-[24px] border border-white/10 bg-black/40 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ImageIcon size={40} className="mx-auto mb-3 text-[#D4AF37]" />
              <p className="text-xs uppercase tracking-[0.25em]">Image Preview Area</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promoIndex}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4 }}
        className={`relative overflow-hidden rounded-[36px] border backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${
          isUpcoming
            ? 'border-blue-500/25 bg-blue-500/[0.04]'
            : 'border-[#D4AF37]/25 bg-[linear-gradient(135deg,rgba(212,175,55,0.12),rgba(255,255,255,0.03))]'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_28%)]" />

        <motion.div
          animate={{ x: ['-100%', '120%'] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_50%)]" />
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-0 min-h-[290px] md:min-h-[310px]">
          <div className="p-6 md:p-7 lg:p-8 xl:p-10 text-left flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] ${
                  isUpcoming
                    ? 'border-blue-400/25 bg-blue-400/10 text-blue-300'
                    : 'border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]'
                }`}
              >
                {isUpcoming ? <Timer size={13} /> : <BadgePercent size={13} />}
                {isUpcoming ? 'Upcoming Offer' : 'Live Promotion'}
              </span>

              {currentAnnouncement?.urgent && (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.28em] animate-pulse">
                  Urgent
                </span>
              )}
            </div>

            <motion.h3
              animate={
                !isUpcoming
                  ? {
                      textShadow: [
                        '0 0 0px rgba(212,175,55,0)',
                        '0 0 18px rgba(212,175,55,0.18)',
                        '0 0 0px rgba(212,175,55,0)'
                      ]
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl md:text-5xl xl:text-[3.5rem] font-black uppercase tracking-tight leading-[0.95]"
            >
              {currentAnnouncement.title}
            </motion.h3>

            <p className="text-sm md:text-base lg:text-lg text-gray-300 mt-3 leading-relaxed max-w-3xl">
              {currentAnnouncement.message}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <MetaPill
                icon={<CalendarDays size={13} />}
                text={`Starts: ${formatDate(currentAnnouncement.startDate)}`}
              />
              <MetaPill
                icon={<Clock size={13} />}
                text={`Ends: ${formatDate(currentAnnouncement.expiryDate)}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link to="/auth?mode=customer">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(212,175,55,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUpcoming}
                  className={`px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.18em] text-xs flex items-center justify-center gap-2 ${
                    isUpcoming
                      ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                      : 'bg-[#D4AF37] text-black'
                  }`}
                >
                  {isUpcoming ? 'Coming Soon' : 'View Offer'}
                  {!isUpcoming && <ArrowRight size={15} />}
                </motion.button>
              </Link>

              {promoAnnouncements.length > 1 && (
                <div className="flex items-center gap-2">
                  {promoAnnouncements.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPromoIndex(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === promoIndex ? 'w-10 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative min-h-[220px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-white/10">
            {imageUrl ? (
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  key={imageUrl}
                  initial={{ scale: 1.08, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  src={imageUrl}
                  alt={currentAnnouncement?.title || 'Promotion'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_35%)]" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.03))] flex items-center justify-center">
                <div className="text-center px-6">
                  <ImageIcon size={44} className="mx-auto mb-4 text-[#D4AF37]" />
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                    Promotion Image
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Add imageUrl in your announcement form/API
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-3.5"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black mb-1.5">
                  Featured Campaign
                </p>
                <p className="text-sm text-white font-semibold line-clamp-2">
                  {currentAnnouncement.title}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const getAnnouncementImage = (announcement) => {
  if (!announcement) return '';

  return (
    announcement.imageUrl ||
    announcement.image ||
    announcement.photoUrl ||
    announcement.bannerUrl ||
    announcement.imagePath ||
    ''
  );
};

const MiniChip = ({ icon, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' }
      }
    }}
    whileHover={{ y: -2, borderColor: 'rgba(212,175,55,0.3)' }}
    className="px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-2 text-xs text-gray-200"
  >
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </motion.div>
);

const MetaPill = ({ icon, text }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </div>
);

const PremiumBadge = ({ icon, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' }
      }
    }}
    whileHover={{ y: -3, borderColor: 'rgba(212,175,55,0.35)' }}
    className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-3 text-sm text-gray-200"
  >
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </motion.div>
);

const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 35 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }
    }}
    whileHover={{ y: -8, borderColor: 'rgba(212,175,55,0.4)' }}
    className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8"
  >
    <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold tracking-tight mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{text}</p>
  </motion.div>
);

const CategoryCard = ({ icon, title, count }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 35 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }
    }}
    whileHover={{
      backgroundColor: 'rgba(212, 175, 55, 0.05)',
      borderColor: 'rgba(212, 175, 55, 0.4)',
      y: -10
    }}
    className="p-8 md:p-10 rounded-[28px] border border-white/5 bg-[#0a0a0a] group cursor-pointer relative overflow-hidden transition-all"
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <p className="text-3xl font-black mb-2 tracking-tighter group-hover:text-[#D4AF37] transition-colors">
      {count}
    </p>
    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
      {title}
    </h3>
  </motion.div>
);

const ContactLink = ({ icon, label, val, isLink }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -20 },
      show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
      }
    }}
    whileHover={{ x: 8 }}
    className="flex items-center gap-5 group cursor-pointer"
  >
    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
        {label}
      </p>
      <p
        className={`text-lg md:text-xl font-medium ${
          isLink ? 'underline decoration-[#D4AF37]/30 group-hover:text-[#D4AF37]' : ''
        } transition-colors`}
      >
        {val}
      </p>
    </div>
  </motion.div>
);

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString();
};

export default LandingPage;