import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className,
  placeholder = "Search stories, authors, or tags...",
  onSearch,
  variant = "default"
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const baseStyles = "relative flex items-center transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg",
    hero: "bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl rounded-xl border border-gray-200 dark:border-slate-700"
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        baseStyles,
        variants[variant],
        isFocused && "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900",
        className
      )}
    >
      <ApperIcon 
        name="Search" 
        className="absolute left-4 w-5 h-5 text-gray-400 dark:text-slate-500 pointer-events-none" 
      />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none"
      />
      
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-4 p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;