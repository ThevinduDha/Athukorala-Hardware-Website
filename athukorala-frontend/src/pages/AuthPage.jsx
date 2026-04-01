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
  EyeOff
} from 'lucide-react';
import heroImg from '../assets/hero.png';
import { toast, Toaster } from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 10) + 6,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 6 + 6
      })),
    []
  );

  const onSubmit = async (data) => {
    setAuthError('');
    const loadingToast = toast.loading(
      isLogin ? 'Authenticating...' : 'Creating Account...'
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
          isLogin ? `Access Granted: ${result.name}` : 'Account Created!',
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
        }
      } else {
        if (isLogin) {
          setAuthError('Your email or password is wrong');
        }
        toast.error(result.message || 'Invalid Credentials', {
          id: loadingToast
        });
      }
    } catch (error) {
      if (isLogin) {
        setAuthError('Your email or password is wrong');
      }
      toast.error('Connection Failed. Is IntelliJ running?', {
        id: loadingToast
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white font-sans">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #D4AF37',
            borderRadius: '12px',
            fontSize: '12px',
            letterSpacing: '0.08em'
          }
        }}
      />

      {/* Animated background layers */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#D4AF37]/10 rounded-full blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[420px] h-[420px] bg-yellow-400/10 rounded-full blur-[130px]"
        />

        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_45%)]"
        />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-[#D4AF37]/30"
            style={{
              width: particle.size,
              height: particle.size,
              top: particle.top,
              left: particle.left
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.7, 0.15],
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

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="relative z-20 flex min-h-screen">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl border border-[#D4AF37]/20 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.08)]">
                <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <Hammer className="text-[#D4AF37]" size={22} />
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-gray-300">
                  {isAdminMode ? 'Industrial Portal' : 'Client Portal'}
                </span>
              </div>

              <motion.h2
                key={isLogin ? 'login-title' : 'signup-title'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none"
              >
                {isLogin ? 'System' : 'Create'}
                <br />
                <span className="text-[#D4AF37] drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]">
                  {isLogin ? 'Login' : 'Account'}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-5 text-sm text-gray-400 max-w-md leading-relaxed"
              >
                {isLogin
                  ? 'Securely access your dashboard with a smoother animated login experience.'
                  : 'Join the platform with a modern sign up interface and premium visual feel.'}
              </motion.p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.35)]"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="pointer-events-none absolute top-0 left-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
              />

              {!isAdminMode && (
                <div className="mb-8 flex rounded-2xl border border-white/10 bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setAuthError('');
                    }}
                    className={`relative w-1/2 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] transition-all ${
                      isLogin
                        ? 'text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-[#D4AF37]"
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      />
                    )}
                    <span className="relative z-10">Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setAuthError('');
                    }}
                    className={`relative w-1/2 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] transition-all ${
                      !isLogin
                        ? 'text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {!isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-[#D4AF37]"
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      />
                    )}
                    <span className="relative z-10">Sign Up</span>
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
                      <div className="relative">
                        <input
                          {...register('name', {
                            required: 'Legal Name is mandatory'
                          })}
                          placeholder="FULL NAME"
                          className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition-all duration-300 focus:border-[#D4AF37] focus:bg-black/30 placeholder:text-gray-500 tracking-[0.18em] text-sm uppercase"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-[10px] mt-2 tracking-[0.12em] uppercase font-bold">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <input
                    {...register('email', {
                      required: 'Identifier is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Identifier must contain @'
                      }
                    })}
                    placeholder="IDENTIFIER (EMAIL)"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition-all duration-300 focus:border-[#D4AF37] focus:bg-black/30 placeholder:text-gray-500 tracking-[0.18em] text-sm uppercase"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] mt-2 tracking-[0.12em] uppercase font-bold">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register(
                      'password',
                      isLogin
                        ? {
                            required: 'Access Key is required'
                          }
                        : {
                            required: 'Access Key is required',
                            minLength: {
                              value: 8,
                              message: 'Security depth must be 8+ characters'
                            }
                          }
                    )}
                    placeholder="ACCESS KEY"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 pr-14 outline-none transition-all duration-300 focus:border-[#D4AF37] focus:bg-black/30 placeholder:text-gray-500 tracking-[0.18em] text-sm uppercase"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {errors.password && (
                    <p className="text-red-500 text-[10px] mt-2 tracking-[0.12em] uppercase font-bold">
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                <AnimatePresence>
                  {isLogin && authError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-[10px] tracking-[0.12em] uppercase font-bold"
                    >
                      {authError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.35)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-[#D4AF37] text-black font-black py-4 sm:py-5 flex items-center justify-center gap-3 tracking-[0.25em] uppercase"
                >
                  <motion.span
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute inset-y-0 left-0 w-16 bg-white/30 blur-md skew-x-12"
                  />
                  <span className="relative z-10">
                    {isLogin ? 'Authenticate' : 'Initialize Account'}
                  </span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.button>
              </form>

              <div className="mt-8 flex items-center justify-between gap-3 text-[10px] tracking-[0.18em] uppercase font-bold text-gray-500 border-t border-white/10 pt-6">
                {!isAdminMode ? (
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                    }}
                    className="hover:text-[#D4AF37] transition-colors text-left"
                  >
                    {isLogin ? 'New Entry / Sign Up' : 'Existing Member / Login'}
                  </button>
                ) : (
                  <span className="text-[#D4AF37]/70 border border-[#D4AF37]/20 px-3 py-2 rounded-xl">
                    Restricted Industrial Access
                  </span>
                )}

                <span className="flex items-center gap-2 text-right">
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  Secure Encryption
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.12, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0.78 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/35 to-black/20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.8),rgba(5,5,5,0.18),rgba(212,175,55,0.06))]" />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-16 rounded-3xl border border-[#D4AF37]/20 bg-black/30 backdrop-blur-xl px-5 py-4 shadow-[0_0_25px_rgba(212,175,55,0.1)]"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#D4AF37]" size={18} />
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
                  Premium Access
                </p>
                <p className="text-[11px] text-gray-300 mt-1">
                  Smart, secure and modern interface
                </p>
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-16 left-12 right-12">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-10 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
            >
              <p className="text-[#D4AF37] text-3xl xl:text-4xl font-serif italic leading-tight mb-6">
                "Precision in every
                <br />
                Athukorala shipment."
              </p>

              <div className="h-[2px] w-24 bg-[#D4AF37]/60 rounded-full mb-5" />

              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                Built for reliability, elegant access control, and a more
                cinematic authentication experience.
              </p>

              <div className="mt-8 flex items-center gap-3 text-[10px] tracking-[0.45em] uppercase text-gray-400 font-bold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37]" />
                Industrial Grade Systems
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;