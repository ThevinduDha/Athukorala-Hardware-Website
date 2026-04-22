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
  Moon
} from 'lucide-react';
import heroImg from '../assets/hero.png';
import { toast, Toaster } from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 8) + 5,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 7 + 6
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
          }, 1200);
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

  const sectionReveal = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-black'}`}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: isDarkMode ? '#111' : '#f5f5f5',
            color: isDarkMode ? '#fff' : '#000',
            border: `1px solid ${isDarkMode ? '#D4AF37' : '#D4AF37'}`,
            borderRadius: '14px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            boxShadow: '0 10px 35px rgba(0,0,0,0.35)'
          }
        }}
      />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isDarkMode && (
          <>
            <motion.div
              animate={{ x: [0, 45, 0], y: [0, -28, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#D4AF37]/10 rounded-full blur-[120px]"
            />

            <motion.div
              animate={{ x: [0, -35, 0], y: [0, 30, 0] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[-10%] right-[-10%] w-[430px] h-[430px] bg-yellow-400/10 rounded-full blur-[135px]"
            />

            <motion.div
              animate={{ opacity: [0.12, 0.28, 0.12] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_45%)]"
            />

            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-[#D4AF37]/25"
                style={{
                  width: particle.size,
                  height: particle.size,
                  top: particle.top,
                  left: particle.left
                }}
                animate={{
                  y: [0, -24, 0],
                  opacity: [0.12, 0.7, 0.12],
                  scale: [1, 1.25, 1]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'easeInOut'
                }}
              />
            ))}

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />
          </>
        )}
        
        {!isDarkMode && (
          <div className="absolute inset-0 bg-gray-50" />
        )}
      </div>

      <div className="relative z-20 flex min-h-screen">
        {/* Left panel */}
        <div className="w-full lg:w-[52%] flex items-center justify-center px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 py-7 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="w-full max-w-[620px]"
          >
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="show"
              className="mb-6"
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#D4AF37]/20 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.08)] ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                  <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                    <Hammer className="text-[#D4AF37]" size={20} />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold tracking-[0.32em] uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isAdminMode ? 'Industrial Portal' : 'Client Portal'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`group inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 transition-all text-[11px] tracking-[0.2em] uppercase ${isDarkMode ? 'bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 text-gray-300 hover:text-[#D4AF37]' : 'bg-black/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-gray-600 hover:text-[#D4AF37] border-black/10'}`}
                >
                  <ChevronLeft
                    size={14}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Home
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-[11px] tracking-[0.2em] uppercase ${isDarkMode ? 'border-white/10 bg-white/5 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 text-gray-300 hover:text-[#D4AF37]' : 'border-black/10 bg-black/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 text-gray-600 hover:text-[#D4AF37]'}`}
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                  {isDarkMode ? 'Light' : 'Dark'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-title' : 'signup-title'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black tracking-tight uppercase leading-[0.94]">
                    {isLogin ? 'System' : 'Create'}
                    <br />
                    <span className="text-[#D4AF37] drop-shadow-[0_0_18px_rgba(212,175,55,0.3)]">
                      {isLogin ? 'Login' : 'Account'}
                    </span>
                  </h1>

                  <p className={`mt-4 text-sm sm:text-base max-w-md leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isLogin
                      ? 'Securely access your dashboard with a smoother animated login experience.'
                      : 'Join the platform with a premium sign up experience and elegant access flow.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Form Card */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.08 }}
              className={`relative overflow-hidden rounded-[30px] border backdrop-blur-2xl p-5 sm:p-6 md:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.34)] ${isDarkMode ? 'border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]' : 'border-black/10 bg-white'}`}
            >
              {isDarkMode && (
                <motion.div
                  animate={{ x: ['-100%', '110%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute top-0 left-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-75"
                />
              )}

              {!isAdminMode && (
                <div className={`mb-6 flex rounded-2xl border p-1.5 ${isDarkMode ? 'border-white/10 bg-black/25' : 'border-black/10 bg-gray-100'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setAuthError('');
                    }}
                    className={`relative w-1/2 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.24em] transition-all ${
                      isLogin ? (isDarkMode ? 'text-black' : 'text-white') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')
                    }`}
                  >
                    {isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-[#D4AF37]"
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
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
                    className={`relative w-1/2 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.24em] transition-all ${
                      !isLogin ? (isDarkMode ? 'text-black' : 'text-white') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')
                    }`}
                  >
                    {!isLogin && (
                      <motion.div
                        layoutId="authSwitch"
                        className="absolute inset-0 rounded-xl bg-[#D4AF37]"
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      />
                    )}
                    <span className="relative z-10">Sign Up</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <InputWrap icon={<User2 size={18} />} isDarkMode={isDarkMode}>
                        <input
                          {...register('name', {
                            required: 'Legal Name is mandatory'
                          })}
                          placeholder="FULL NAME"
                          className={`auth-input ${isDarkMode ? 'dark' : 'light'}`}
                        />
                      </InputWrap>
                      {errors.name && <p className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}>{errors.name.message}</p>}
                      
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <InputWrap icon={<Mail size={18} />} isDarkMode={isDarkMode}>
                    <input
                      {...register('email', {
                        required: 'Identifier is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Identifier must contain @'
                        }
                      })}
                      placeholder="IDENTIFIER (EMAIL)"
                      className={`auth-input ${isDarkMode ? 'dark' : 'light'}`}
                    />
                  </InputWrap>
                  {errors.email && <p className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}>{errors.email.message}</p>}
                </div>

                <div>
                  <InputWrap icon={<Lock size={18} />} isDarkMode={isDarkMode}>
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
                  {errors.password && <p className={`auth-error ${isDarkMode ? 'dark' : 'light'}`}>{errors.password.message}</p>}

                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className={`text-[10px] tracking-[0.12em] uppercase font-bold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-[#D4AF37]' : 'text-gray-600 hover:text-[#D4AF37]'}`}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isLogin && authError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-red-500 text-[10px] mt-1 tracking-[0.12em] uppercase font-bold ${isDarkMode ? 'dark' : 'light'}`}
                    >
                      {authError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.015,
                    boxShadow: '0 0 30px rgba(212,175,55,0.3)'
                  }}
                  whileTap={{ scale: 0.985 }}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-[#D4AF37] text-black font-black py-4 flex items-center justify-center gap-3 tracking-[0.24em] uppercase text-sm"
                >
                  <motion.span
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
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

              <div className={`mt-6 flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] uppercase font-bold border-t pt-5 flex-wrap ${isDarkMode ? 'text-gray-500 border-white/10' : 'text-gray-600 border-black/10'}`}>
                {!isAdminMode ? (
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                    }}
                    className={`hover:text-[#D4AF37] transition-colors text-left ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {isLogin ? 'New Entry / Sign Up' : 'Existing Member / Login'}
                  </button>
                ) : (
                  <span className={`text-[#D4AF37]/75 border border-[#D4AF37]/20 px-3 py-2 rounded-xl ${isDarkMode ? 'text-[#D4AF37]/75' : 'text-[#D4AF37]'}`}>
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

        {/* Right panel */}
        <div className="hidden lg:block lg:w-[48%] relative overflow-hidden border-l border-white/5">
          <motion.div
            initial={{ scale: 1.06, opacity: 0.56 }}
            animate={{ scale: 1, opacity: 0.82 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          />

          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-[#050505] via-[#050505]/20 to-black/12' : 'bg-gradient-to-r from-white via-white/80 to-transparent'}`} />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[linear-gradient(to_top,rgba(5,5,5,0.84),rgba(5,5,5,0.12),rgba(212,175,55,0.05))]' : 'bg-[linear-gradient(to_top,rgba(255,255,255,0.84),rgba(255,255,255,0.12),rgba(212,175,55,0.05))]'}`} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            className={`absolute top-10 right-8 xl:right-12 rounded-3xl border border-[#D4AF37]/20 backdrop-blur-xl px-5 py-4 shadow-[0_0_25px_rgba(212,175,55,0.1)] ${isDarkMode ? 'bg-black/35' : 'bg-white/80'}`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#D4AF37]" size={18} />
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
                  Premium Access
                </p>
                <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Smart, secure and modern interface
                </p>
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center px-8 xl:px-12">
            <motion.img
              src={heroImg}
              alt="Auth Visual"
              initial={{ scale: 1.04, opacity: 0.15 }}
              animate={{ scale: 1, opacity: 0.28 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 m-auto h-[72%] w-auto object-contain pointer-events-none select-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.8 }}
              className="relative z-10 w-full max-w-[760px]"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
                className={`rounded-[30px] border backdrop-blur-2xl p-8 xl:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.35)] ${isDarkMode ? 'border-white/10 bg-[linear-gradient(135deg,rgba(0,0,0,0.62),rgba(20,20,20,0.44))]' : 'border-black/10 bg-white/80'}`}
              >
                <p className="text-[#D4AF37] text-3xl xl:text-[2.8rem] font-serif italic leading-tight mb-5">
                  "Precision in every
                  <br />
                  Athukorala shipment."
                </p>

                <div className="h-[2px] w-24 bg-[#D4AF37]/60 rounded-full mb-5" />

                <p className={`text-sm leading-relaxed max-w-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Built for reliability, elegant access control, and a more
                  cinematic authentication experience.
                </p>

                <div className="mt-7 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase font-bold">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Industrial Grade Systems</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat icon={<ShieldCheck size={14} />} text="Secure Access" isDarkMode={isDarkMode} />
                  <MiniStat icon={<BadgeCheck size={14} />} text="Premium UI" isDarkMode={isDarkMode} />
                </div>
              </motion.div>
            </motion.div>
          </div>
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
          letter-spacing: 0.16em;
          font-size: 0.92rem;
          text-transform: uppercase;
        }

        .auth-input.dark {
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.20);
          color: white;
        }

        .auth-input.light {
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          color: black;
        }

        .auth-input::placeholder {
          color: rgb(107 114 128);
        }

        .auth-input:focus {
          border-color: rgba(212,175,55,1);
          background: rgba(0,0,0,0.32);
          box-shadow: 0 0 0 4px rgba(212,175,55,0.08);
        }

        .auth-input.light:focus {
          background: rgba(255,255,255,0.95);
        }

        .auth-error {
          color: rgb(239 68 68);
          font-size: 10px;
          margin-top: 0.5rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

const InputWrap = ({ icon, children, isDarkMode }) => (
  <motion.div whileFocus={{ scale: 1.01 }} className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] z-10">
      {icon}
    </span>
    {children}
  </motion.div>
);

const MiniStat = ({ icon, text, isDarkMode }) => (
  <div className={`rounded-2xl border px-4 py-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-300' : 'border-black/10 bg-black/5 text-gray-600'}`}>
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </div>
);

export default AuthPage;