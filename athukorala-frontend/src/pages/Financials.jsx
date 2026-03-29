import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { TrendingUp, DollarSign, Package, PieChart as PieIcon, Activity, ArrowUpRight } from 'lucide-react';

const Financials = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#D4AF37', '#AA8A2E', '#806622', '#554417', '#2B220B'];

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/summary")
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => console.error("Analytics Stream Offline"));
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-[#D4AF37] font-black tracking-[0.5em]">INITIALIZING ANALYTICS...</div>;

  // Formatting category data for Recharts
  const chartData = Object.keys(reportData.categoryValuations).map(key => ({
    name: key.toUpperCase(),
    value: reportData.categoryValuations[key],
    units: reportData.itemsByCategory[key]
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-10 text-left"
    >
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={14} className="text-[#D4AF37]" />
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Fiscal Intelligence</p>
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
          Financial <span className="text-transparent stroke-text">Registry</span>
        </h1>
      </header>

      {/* --- TOP STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Total Stock Valuation</p>
          <h3 className="text-5xl font-black tracking-tighter text-[#D4AF37]">
            LKR {reportData.totalStockValue.toLocaleString()}
          </h3>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-green-500">
            <ArrowUpRight size={14}/> SYSTEM STABLE
          </div>
        </div>

        <div className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden group text-right">
          <div className="absolute top-0 right-0 w-1 h-full bg-white/20" />
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Gross Asset Volume</p>
          <h3 className="text-5xl font-black tracking-tighter text-white">
            {reportData.totalUnitsStored.toLocaleString()} <span className="text-xl text-gray-600">UNITS</span>
          </h3>
          <p className="mt-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Across {chartData.length} active categories</p>
        </div>
      </div>

      {/* --- CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Valuation (Donut) */}
        <div className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-md h-[500px]">
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-gray-400 mb-10 flex items-center gap-3">
            <PieIcon size={16} /> Valuation Distribution
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(212,175,55,0.2)', color: '#fff' }}
                itemStyle={{ color: '#D4AF37', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Unit Count (Bar Chart) */}
        <div className="p-10 border border-white/5 bg-white/[0.01] backdrop-blur-md h-[500px]">
          <h3 className="text-xs font-black tracking-[0.4em] uppercase text-gray-400 mb-10 flex items-center gap-3">
            <Activity size={16} /> Asset Inventory Density
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                 cursor={{ fill: 'rgba(212,175,55,0.05)' }}
                 contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(212,175,55,0.2)' }}
                 itemStyle={{ color: '#D4AF37', fontSize: '10px' }}
              />
              <Bar dataKey="units" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </motion.div>
  );
};

export default Financials;