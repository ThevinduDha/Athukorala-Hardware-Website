import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, TrendingDown, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiscountSuggestionPanel = ({ onApplyClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real scenario, this calls a Java endpoint that filters based on Python AI output
    // For now, we simulate the 'Top 3 Highest Stock' logic 
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => {
        const topOverstocked = data
          .sort((a, b) => b.stockQuantity - a.stockQuantity) // Sort Highest to Lowest
          .slice(0, 3); // Pick Top 3
        setSuggestions(topOverstocked);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 backdrop-blur-3xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit size={120} className="text-[#D4AF37]" />
      </div>

      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D4AF37] text-black">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">AI Recommendation Engine</h3>
            <p className="text-white text-xs font-bold uppercase tracking-widest">Stock Optimization Strategy</p>
          </div>
        </div>
        <div className="hidden md:block px-4 py-1 border border-[#D4AF37]/30 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
          Mode: Predictive Analysis
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/40 border border-white/5 p-6 hover:border-[#D4AF37]/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">High Stock Risk</p>
              <TrendingDown size={14} className="text-red-500" />
            </div>
            
            <h4 className="text-sm font-black uppercase tracking-tight mb-1 truncate">{item.name}</h4>
            <p className="text-[10px] font-mono text-[#D4AF37] mb-6">UNITS: {item.stockQuantity}</p>

            <button 
              onClick={() => onApplyClick(item)} // UPDATED: Calls the bridge function
              className="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#D4AF37] group-hover:text-black transition-all"
            >
              Apply Discount <ArrowRight size={12} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 text-gray-500 italic">
        <AlertCircle size={14} />
        <p className="text-[9px] font-medium uppercase tracking-widest">
          Suggestion: High stock detected. Consider applying discounts to clear slow-moving assets.
        </p>
      </div>
    </div>
  );
};

export default DiscountSuggestionPanel;