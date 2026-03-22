import React from 'react';
import { useForm } from 'react-hook-form';
import { Megaphone, Send, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffNoticeManager = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8080/api/notices/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Internal Notice Dispatched to Staff");
        reset();
      }
    } catch (err) {
      toast.error("Network Failure: Could not reach staff server.");
    }
  };

  return (
    <div className="p-10 border border-[#D4AF37]/20 bg-[#D4AF37]/5 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-[#D4AF37]" size={20} />
        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#D4AF37]">Internal Staff Broadcast</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="group">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Notice Title</label>
          <input 
            {...register("title")} 
            placeholder="E.G. WAREHOUSE MAINTENANCE"
            className="w-full bg-white/5 border border-white/10 p-4 focus:border-[#D4AF37] outline-none text-xs uppercase tracking-widest"
          />
        </div>

        <div className="group">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Instructions</label>
          <textarea 
            {...register("message")} 
            className="w-full bg-white/5 border border-white/10 p-4 focus:border-[#D4AF37] outline-none text-xs h-32"
          />
        </div>

        <button className="w-full py-4 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all">
          <Send size={16} /> Broadcast to Staff
        </button>
      </form>
    </div>
  );
};

export default StaffNoticeManager;