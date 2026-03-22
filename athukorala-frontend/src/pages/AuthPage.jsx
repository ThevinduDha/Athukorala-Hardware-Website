import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hammer, ArrowRight, ShieldCheck } from 'lucide-react';
import heroImg from '../assets/hero.png';
import { toast, Toaster } from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // --- SMART SECURITY CHECK ---
  const queryParams = new URLSearchParams(location.search);
  const isAdminMode = queryParams.get('mode') === 'admin';

  const onSubmit = async (data) => {
    const loadingToast = toast.loading(isLogin ? "Authenticating..." : "Creating Account...");
    try {
      const url = isLogin 
        ? "http://localhost:8080/api/auth/login" 
        : "http://localhost:8080/api/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(isLogin ? `Access Granted: ${result.name}` : "Account Created!", { id: loadingToast });
        
        if (isLogin) {
          // Store user data and token for authenticated requests [cite: 87, 136]
          localStorage.setItem("user", JSON.stringify(result));
          
          // --- ROLE-BASED REDIRECT LOGIC [cite: 95, 139] ---
          setTimeout(() => {
            if (result.role === 'ADMIN') {
              navigate("/admin-dashboard"); // Full system access [cite: 100]
            } else if (result.role === 'STAFF') {
              navigate("/staff-dashboard"); // Operational access [cite: 102]
            } else {
              navigate("/customer-dashboard"); // Limited client access [cite: 103]
            }
          }, 1500);
        } else {
          setIsLogin(true);
        }
      } else {
        toast.error(result.message || "Invalid Credentials", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Connection Failed. Is IntelliJ running?", { id: loadingToast });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans">
      <Toaster position="top-right" reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #D4AF37',
            borderRadius: '0',
            fontSize: '12px',
            letterSpacing: '0.1em'
          }
        }} 
      />
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 z-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <Hammer className="text-[#D4AF37]" size={24} />
            </div>
            <span className="text-sm font-bold tracking-[0.4em] uppercase text-gray-500">
               {isAdminMode ? "Industrial Portal" : "Client Portal"}
            </span>
          </div>
          
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
            {isLogin ? "System" : "Join The"} <br />
            <span className="text-[#D4AF37]">{isLogin ? "Login" : "Legacy"}</span>
          </h2>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
          <AnimatePresence mode='wait'>
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="group">
                  <input 
                    {...register("name", { required: "Name is required" })}
                    placeholder="FULL NAME" 
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-700 tracking-widest text-sm uppercase"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="group">
            <input 
              {...register("email", { required: "Email is required" })}
              placeholder="IDENTIFIER (EMAIL)" 
              className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-700 tracking-widest text-sm uppercase"
            />
          </div>

          <div className="group">
            <input 
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="ACCESS KEY" 
              className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-700 tracking-widest text-sm uppercase"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#E5C158" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#D4AF37] text-black font-black py-5 flex items-center justify-center gap-4 tracking-[0.3em] uppercase mt-10"
          >
            {isLogin ? "Authenticate" : "Initialize Account"}
            <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-12 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-bold text-gray-600 border-t border-white/5 pt-8">
           
           {/* --- SECURITY GUARD LOGIC [cite: 78] --- */}
           {!isAdminMode ? (
             <button onClick={() => setIsLogin(!isLogin)} className="hover:text-[#D4AF37] transition-colors">
               {isLogin ? "New Entry / Sign Up" : "Existing Member / Login"}
             </button>
           ) : (
             <span className="text-[#D4AF37]/50 border border-[#D4AF37]/20 px-3 py-1">Restricted Industrial Access</span>
           )}
           
           <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#D4AF37]"/> Secure Encryption</span>
        </div>
      </div>

      {/* Right Hero Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-black/20" />
        <div className="absolute bottom-20 left-20 right-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-12 border border-white/10 backdrop-blur-md bg-black/40">
            <p className="text-[#D4AF37] font-serif text-3xl italic leading-tight mb-6">
              "Precision in every <br /> Athukorala shipment."
            </p>
            <div className="h-[1px] w-20 bg-[#D4AF37]/50" />
            <p className="mt-6 text-[9px] tracking-[0.6em] uppercase text-gray-500 font-bold">
              Industrial Grade Systems
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;