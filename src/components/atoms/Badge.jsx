import { cn } from "@/utils/cn";

const Badge = ({ 
  className,
  variant = "default",
  size = "sm",
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300",
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
    secondary: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    outline: "border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;