import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  helperText,
  required = false,
  rows = 4,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical";
  
  const errorStyles = "border-red-300 dark:border-red-700 focus:ring-red-500";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          baseStyles,
          error && errorStyles,
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;