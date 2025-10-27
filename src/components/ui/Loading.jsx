import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default", ...props }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-6", className)} {...props}>
        {/* Story card skeletons */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded w-3/4" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded w-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded w-2/3" />
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-full" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)} {...props}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-slate-400 font-medium">Loading amazing stories...</p>
      </div>
    </div>
  );
};

export default Loading;