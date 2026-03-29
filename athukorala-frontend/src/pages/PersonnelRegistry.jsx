import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, ShieldCheck, ShieldAlert, 
  ArrowUp, ArrowDown, Search, MoreHorizontal, Activity 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PersonnelRegistry = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users/all")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => toast.error("Registry Link Failed"));
  };

  useEffect(() => fetchUsers(), []);

  const handleRoleChange = async (userId, currentRole, direction) => {
    const roles = ['CUSTOMER', 'STAFF', 'ADMIN'];
    const currentIndex = roles.indexOf(currentRole);
    const newIndex = direction === 'UP' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex < 0 || newIndex >= roles.length) return;

    const newRole = roles[newIndex];
    const loading = toast.loading(`Reassigning Credentials to ${newRole}...`);

    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}/change-role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        toast.success(`Access Tier Updated: ${newRole}`, { id: loading });
        fetchUsers();
      }
    } catch (err) {
      toast.error("Protocol Overridden: Network Error", { id: loading });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
            <ShieldCheck size={14} />
            <p className="text-[10px] font-black uppercase tracking-[0.6em]">Permission Command</p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Personnel <span className="text-transparent stroke-text">Registry</span>
          </h1>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37]" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH PERSONNEL..." 
            className="bg-white/5 border border-white/10 py-4 pl-12 pr-6 text-[10px] tracking-widest outline-none focus:border-[#D4AF37] w-80 uppercase font-black transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {filteredUsers.map((person) => (
            <motion.div 
              layout
              key={person.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-full ${
                  person.role === 'ADMIN' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 
                  person.role === 'STAFF' ? 'bg-blue-500/10 text-blue-500' : 
                  'bg-gray-500/10 text-gray-500'
                } border border-white/5 group-hover:scale-110 transition-transform`}>
                  {person.role === 'ADMIN' ? <ShieldAlert size={24} /> : 
                   person.role === 'STAFF' ? <ShieldCheck size={24} /> : 
                   <User size={24} />}
                </div>

                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{person.name}</h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{person.email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[8px] font-black px-2 py-0.5 border ${
                      person.role === 'ADMIN' ? 'border-[#D4AF37] text-[#D4AF37]' : 
                      person.role === 'STAFF' ? 'border-blue-500 text-blue-500' : 
                      'border-gray-600 text-gray-600'
                    } uppercase tracking-[0.2em]`}>
                      Tier: {person.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {/* DEMOTE BUTTON */}
                {person.role !== 'CUSTOMER' && (
                  <ActionButton 
                    icon={<ArrowDown size={14} />} 
                    label="Demote" 
                    color="hover:text-red-500" 
                    onClick={() => handleRoleChange(person.id, person.role, 'DOWN')} 
                  />
                )}
                
                {/* PROMOTE BUTTON */}
                {person.role !== 'ADMIN' && (
                  <ActionButton 
                    icon={<ArrowUp size={14} />} 
                    label="Promote" 
                    color="hover:text-green-500" 
                    onClick={() => handleRoleChange(person.id, person.role, 'UP')} 
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ${color} hover:bg-white/10 transition-all`}
  >
    {icon} {label}
  </button>
);

export default PersonnelRegistry;