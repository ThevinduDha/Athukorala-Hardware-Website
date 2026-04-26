import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Hammer,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User2,
  ChevronLeft,
  BadgeCheck,
  Sun,
  Moon,
  Crown,
  Fingerprint,
  Zap,
  Gift,
  Rocket,
  Star,
  Diamond,
  CheckCircle2,
  Loader2,
  Key,
  Smartphone,
  Globe,
  Award
} from 'lucide-react';
import heroImg from '../assets/hero.png';
import { toast, Toaster } from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur'
  });

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isAdminMode = queryParams.get('mode') === 'admin';

  // Advanced particle system
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 10) + 2,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: Math.random() * 10 + 6,
        color: Math.random() > 0.8 ? '#D4AF37' : '#ffffff'
      })),
    []
  );

  // Animated gradient positions
  const gradientPositions = useMemo(
    () => [
      { x: [0, 50, 0], y: [0, -30, 0], duration: 15 },
      { x: [0, -40, 0], y: [0, 40, 0], duration: 18 },
      { x: [0, 60, 0], y: [0, -20, 0], duration: 20 }
    ],
    []
  );

  const onSubmit = async (data) => {
    setAuthError('');
    setIsLoading(true);
    const loadingToast = toast.loading(
      isLogin ? '🔐 Authenticating...' : '✨ Creating Account...',
      {
        style: {
          background: isDarkMode ? '#111' : '#f5f5f5',
          color: isDarkMode ? '#fff' : '#000',
          border: '1px solid #D4AF37',
          borderRadius: '14px'
        }
      }
    );

    try {
      const url = isLogin
        ? 'http://localhost:8080/api/auth/login'
        : 'http://localhost:8080/api/auth/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          isLogin ? `✨ Welcome back, ${result.name}!` : '🎉 Account Created Successfully!',
          { id: loadingToast }
        );

        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(result));

          setTimeout(() => {
            if (result.role === 'ADMIN') {
              navigate('/admin-dashboard');
            } else if (result.role === 'STAFF') {
              navigate('/staff-dashboard');
            } else {
              navigate('/customer-dashboard');
            }
          }, 1500);
        } else {
          setIsLogin(true);
          toast.success('Please login with your new account', {
            icon: '🔑',
            duration: 3000
          });
        }
      } else {
        if (isLogin) {
          setAuthError('Invalid email or password. Please try again.');
        }
        toast.error(result.message || 'Authentication Failed', {
          id: loadingToast
        });
      }
    } catch (error) {
      if (isLogin) {
        setAuthError('Connection failed. Please check your network.');
      }
      toast.error('Connection Failed. Is the server running?', {
        id: loadingToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sectionReveal = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const floatAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const pulseGlow = {
    animate: {
      boxShadow: [
        '0 0 0px rgba(212,175,55,0)',
        '0 0 20px rgba(212,175,55,0.3)',
        '0 0 0px rgba(212,175,55,0)'
      ],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`${!isDarkMode ? '🌙 Dark' : '☀️ Light'} mode activated`, {
      icon: !isDarkMode ? '🌙' : '☀️',
      duration: 1500,
      style: {
        background: isDarkMode ? '#111' : '#f5f5f5',
        color: isDarkMode ? '#fff' : '#000',
        border: '1px solid #D4AF37'
      }
    });
  };

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-black'}`}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#111' : '#f5f5f5',
            color: isDarkMode ? '#fff' : '#000',
            border: `1px solid #D4AF37`,
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }
        }}
      />

      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {gradientPositions.map((pos, idx) => (
          <motion.div
            key={idx}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ duration: pos.duration, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute rounded-full blur-[100px] ${
              idx === 0 ? 'top-20 left-20 w-[400px] h-[400px] bg-[#D4AF37]/15' :
              idx === 1 ? 'bottom-20 right-20 w-[450px] h-[450px] bg-purple-500/10' :
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              top: particle.top,
              left: particle.left,
              background: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(particle.id) * 30, 0],
              opacity: [0, 0.6, 0],
              scale: [1, 1.3, 1]
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

      <div className="relative z-20 flex min-h-screen">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[52%] flex items-center justify-center px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 py-7 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[620px]"
          >
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="show"
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.12)] ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="p-2 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-xl"
                  >
                    <Hammer className="text-[#D4AF37]" size={22} />
                  </motion.div>
                  <span className={`text-xs sm:text-sm font-black tracking-[0.32em] uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isAdminMode ? 'Industrial Portal' : 'Client Portal'}
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => navigate('/')}
                  className={`group inline-flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-[11px] tracking-[0.2em] uppercase font-bold ${isDarkMode ? 'border-white/10 bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 text-gray-300 hover:text-[#D4AF37]' : 'border-black/10 bg-black/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-gray-600 hover:text-[#D4AF37]'}`}
                >
                  <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={toggleTheme}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-[11px] tracking-[0.2em] uppercase font-bold ${isDarkMode ? 'border-white/10 bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 text-gray-300 hover:text-[#D4AF37]' : 'border-black/10 bg-black/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-gray-600 hover:text-[#D4AF37]'}`}
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                  {isDarkMode ? 'Light' : 'Dark'}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-title' : 'signup-title'}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div animate={floatAnimation.animate} className="inline-block mb-4">
                    <Crown size={32} className="text-[#D4AF37]" />
                  </motion.div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-black tracking-tighter uppercase leading-[0.9]">
                    {isLogin ? 'Welcome' : 'Join'}
                    <br />
                    <span className="text-[#D4AF37] relative inline-block">
                      {isLogin ? 'Back' : 'The Elite'}
                      <motion.div
                        animate={{ width: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -bottom-2 left-0 h-1 bg-[#D4AF37] rounded-full"
                      />
                    </span>
                  </h1>

                  <p className={`mt-5 text-base sm:text-lg max-w-md leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isLogin
                      ? 'Access your secure dashboard with premium authentication and real-time monitoring.'
                      : 'Create your account and experience the future of industrial supply management.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Form Card */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-[32px] border backdrop-blur-2xl p-6 sm:p-7 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.4)] transition-all ${isDarkMode ? 'border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]' : 'border-black/10 bg-white/90'}`}
            >
              {isDarkMode && (
                <>
                  <motion.div
                    animate={{ x: ['-100%', '120%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                  />
                  <motion.div
                    animate={{ x: ['100%', '-120%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
                    className="pointer-events-none absolute bottom-0 right-0 h-[2px] w-1/2 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent"
                  />
                </>
              )}

              {!isAdminMode && (
                <div className={`mb-8 flex rounded-2xl border p-1.5 ${isDarkMode ? 'border-white/10 bg-black/30' : 'border-black/10 bg-gray-100'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setAuthError('');
                    }}
                    className={`relative w-1/2 rounded-xl py-3.5 text-sm font-black uppercase tracking-[0.24em] transition-all ${
                      isLogin ? (isDarkMode ? 'text-black' : 'text-white') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')
                    }`}
                  >
                    {isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8960F]"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Key size={14} />
                      Login
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setAuthError('');
                    }}
                    className={`relative w-1/2 rounded-xl py-3.5 text-sm font-black uppercase tracking-[0.24em] transition-all ${
                      !isLogin ? (isDarkMode ? 'text-black' : 'text-white') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')
                    }`}
                  >
                    {!isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8960F]"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <User2 size={14} />
                      Sign Up
                    </span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <InputWrap icon={<User2 size={18} />} isDarkMode={isDarkMode}>
                        <input
                          {...register('name', {
                            required: 'Full name is required'
                          })}
                          placeholder="FULL NAME"
                          className={`auth-input ${isDarkMode ? 'dark' : 'light'}`}
                        />
                      </InputWrap>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <InputWrap icon={<Mail size={18} />} isDarkMode={isDarkMode}>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Enter a valid email address'
                        }
                      })}
                      placeholder="EMAIL ADDRESS"
                      className={`auth-input ${isDarkMode ? 'dark' : 'light'}`}
                    />
                  </InputWrap>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <InputWrap icon={<Lock size={18} />} isDarkMode={isDarkMode}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register(
                        'password',
                        isLogin
                          ? { required: 'Password is required' }
                          : {
                              required: 'Password is required',
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                              }
                            }
                      )}
                      placeholder="PASSWORD"
                      className={`auth-input pr-14 ${isDarkMode ? 'dark' : 'light'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </InputWrap>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}

                  {isLogin && (
                    <div className="text-right mt-2">
                      <motion.button
                        whileHover={{ x: 3 }}
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className={`text-[10px] tracking-[0.12em] uppercase font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-[#D4AF37]' : 'text-gray-600 hover:text-[#D4AF37]'}`}
                      >
                        Forgot Password?
                      </motion.button>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isLogin && authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <ShieldCheck size={14} className="text-red-500" />
                      <p className="text-red-500 text-[10px] tracking-[0.12em] uppercase font-bold">
                        {authError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black font-black py-4.5 flex items-center justify-center gap-3 tracking-[0.24em] uppercase text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <motion.span
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 w-20 bg-white/40 blur-md skew-x-12"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Fingerprint size={18} />
                    )}
                    {isLoading 
                      ? (isLogin ? 'Authenticating...' : 'Creating Account...')
                      : (isLogin ? 'Access System' : 'Initialize Account')}
                  </span>
                  {!isLoading && (
                    <ArrowRight
                      size={18}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </motion.button>
              </form>

              <div className={`mt-8 flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] uppercase font-bold border-t pt-6 flex-wrap ${isDarkMode ? 'text-gray-500 border-white/10' : 'text-gray-600 border-black/10'}`}>
                {!isAdminMode ? (
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                    }}
                    className={`hover:text-[#D4AF37] transition-colors text-left flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    <Rocket size={12} />
                    {isLogin ? 'New User? Sign Up' : 'Existing User? Login'}
                  </motion.button>
                ) : (
                  <span className={`flex items-center gap-2 border border-[#D4AF37]/30 px-3 py-2 rounded-xl ${isDarkMode ? 'text-[#D4AF37]/80' : 'text-[#D4AF37]'}`}>
                    <ShieldCheck size={14} />
                    Restricted Industrial Access
                  </span>
                )}

                <motion.span
                  animate={pulseGlow.animate}
                  className="flex items-center gap-2 text-right"
                >
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  Secure Encryption
                </motion.span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-4">
                {[
                  { icon: <ShieldCheck size={12} />, text: '256-bit SSL' },
                  { icon: <BadgeCheck size={12} />, text: 'GDPR Compliant' },
                  { icon: <Award size={12} />, text: 'ISO 27001' }
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    <span className="text-[#D4AF37]">{badge.icon}</span>
                    {badge.text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - Premium Visual */}
        <div className="hidden lg:block lg:w-[48%] relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          />

          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent' : 'bg-gradient-to-r from-white via-white/80 to-transparent'}`} />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[linear-gradient(to_top,rgba(5,5,5,0.9),rgba(5,5,5,0.2),rgba(212,175,55,0.08))]' : 'bg-[linear-gradient(to_top,rgba(255,255,255,0.9),rgba(255,255,255,0.2),rgba(212,175,55,0.08))]'}`} />

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`absolute top-10 right-8 xl:right-12 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-xl px-5 py-4 shadow-[0_0_30px_rgba(212,175,55,0.15)] ${isDarkMode ? 'bg-black/40' : 'bg-white/80'}`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="text-[#D4AF37]" size={18} />
              </motion.div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-black">
                  Premium Access
                </p>
                <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Smart, secure, and modern interface
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image Container */}
          <div className="absolute inset-0 flex items-center justify-center px-8 xl:px-12">
            <motion.img
              src={heroImg}
              alt="Auth Visual"
              initial={{ scale: 1.1, opacity: 0.1 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 m-auto h-[75%] w-auto object-contain pointer-events-none select-none"
            />

            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10 w-full max-w-[800px]"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className={`rounded-[32px] border backdrop-blur-2xl p-10 xl:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.4)] ${isDarkMode ? 'border-white/10 bg-[linear-gradient(135deg,rgba(0,0,0,0.7),rgba(20,20,20,0.5))]' : 'border-black/10 bg-white/85'}`}
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="text-[#D4AF37] text-4xl xl:text-[3.2rem] font-serif italic leading-tight mb-6"
                >
                  "Precision in every
                  <br />
                  Athukorala shipment."
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mb-6"
                />

                <p className={`text-base leading-relaxed max-w-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Built for reliability, elegant access control, and a more
                  cinematic authentication experience with enterprise-grade security.
                </p>

                <div className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase font-black">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block w-2 h-2 rounded-full bg-[#D4AF37]"
                  />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Industrial Grade Systems</span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <MiniStat icon={<ShieldCheck size={14} />} text="Bank-Level Security" isDarkMode={isDarkMode} />
                  <MiniStat icon={<BadgeCheck size={14} />} text="Premium UI/UX" isDarkMode={isDarkMode} />
                  <MiniStat icon={<Zap size={14} />} text="Lightning Fast" isDarkMode={isDarkMode} />
                  <MiniStat icon={<Globe size={14} />} text="24/7 Support" isDarkMode={isDarkMode} />
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 flex justify-center gap-6 pt-6 border-t border-white/10">
                  {['5000+', '98%', '24/7'].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      className="text-center"
                    >
                      <p className="text-lg font-black text-[#D4AF37]">{stat}</p>
                      <p className="text-[8px] uppercase tracking-wider text-gray-500">
                        {idx === 0 ? 'Customers' : idx === 1 ? 'Satisfaction' : 'Support'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-8 left-8 opacity-20"
          >
            <Star size={80} className="text-[#D4AF37]" />
          </motion.div>
        </div>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          padding: 1rem 1rem 1rem 3rem;
          outline: none;
          transition: all 0.3s ease;
          color: black;
          letter-spacing: 0.12em;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .auth-input.dark {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.3);
          color: white;
        }

        .auth-input.light {
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          color: black;
        }

        .auth-input::placeholder {
          color: rgb(107 114 128);
          font-weight: 400;
          letter-spacing: 0.16em;
        }

        .auth-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 4px rgba(212,175,55,0.1);
        }

        .auth-input.dark:focus {
          background: rgba(0,0,0,0.5);
        }

        .auth-input.light:focus {
          background: rgba(255,255,255,0.98);
        }

        .auth-error {
          font-size: 9px;
          margin-top: 0.5rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .auth-error.dark {
          color: #ef4444;
        }

        .auth-error.light {
          color: #dc2626;
        }

        .auth-error::before {
          content: "⚠";
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

const InputWrap = ({ icon, children, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="relative group"
  >
    <motion.span
      whileHover={{ scale: 1.1 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] z-10 transition-transform"
    >
      {icon}
    </motion.span>
    {children}
  </motion.div>
);

const MiniStat = ({ icon, text, isDarkMode }) => (
  <motion.div
    whileHover={{ scale: 1.02, x: 3 }}
    className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] font-bold transition-all ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-300 hover:border-[#D4AF37]/30' : 'border-black/10 bg-black/5 text-gray-600 hover:border-[#D4AF37]/30'}`}
  >
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </motion.div>
);

export default AuthPage;