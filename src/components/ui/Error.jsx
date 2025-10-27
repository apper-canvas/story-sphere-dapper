import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  className,
  title = "Something went wrong",
  message = "We encountered an error while loading your content. Please try again.",
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 transform hover:scale-105"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;