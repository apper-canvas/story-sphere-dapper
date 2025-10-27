import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  className,
  src,
  alt,
  size = "md",
  fallback,
  ...props 
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl"
  };

  const baseStyles = "rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium overflow-hidden";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          baseStyles,
          sizes[size],
          "object-cover",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        baseStyles,
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback ? (
        <span className="font-medium">
          {fallback.charAt(0).toUpperCase()}
        </span>
      ) : (
        <ApperIcon name="User" className="w-1/2 h-1/2" />
      )}
    </div>
  );
};

export default Avatar;