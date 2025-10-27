import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  title = "No stories yet",
  message = "Be the first to share your story with the world.",
  icon = "BookOpen",
  actionLabel,
  onAction,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600 dark:text-primary-400" />
      </div>
      
      <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;