import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    // Default to 'dark' if no theme exists (match App.jsx logic)
    const shouldBeDark = savedTheme === "dark" || savedTheme === null;
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      if (savedTheme === null) localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full mt-4 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-black dark:text-white hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 group"
    >
      {isDark ? (
        <Sun size={16} className="group-hover:rotate-90 transition-transform" />
      ) : (
        <Moon size={16} className="group-hover:rotate-12 transition-transform" />
      )}
      <span className="text-xs uppercase font-bold tracking-widest">
        Theme
      </span>
    </button>
  );
};

export default ThemeToggle;