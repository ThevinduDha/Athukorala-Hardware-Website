import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-3xl font-black uppercase tracking-wide text-center">
          Forgot <span className="text-[#D4AF37]">Password</span>
        </h2>

        <p className="text-gray-400 text-sm mt-3 text-center">
          Enter your email to receive a reset link
        </p>

        <div className="mt-6 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />

          <input
            type="email"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-[#D4AF37] outline-none tracking-widest text-sm"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl bg-[#D4AF37] text-black font-bold flex items-center justify-center gap-2 tracking-widest"
        >
          {loading ? "Sending..." : "Send Reset Link"}
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;