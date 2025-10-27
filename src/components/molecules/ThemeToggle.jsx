import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { THEME, STORAGE_KEYS } from "@/utils/constants";

const ThemeToggle = ({ className }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || THEME.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === THEME.DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-105",
        className
      )}
      title={`Switch to ${theme === THEME.LIGHT ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        <ApperIcon 
          name="Sun" 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            theme === THEME.DARK ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <ApperIcon 
          name="Moon" 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            theme === THEME.LIGHT ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;