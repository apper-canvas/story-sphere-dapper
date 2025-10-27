import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const BookmarkButton = ({ 
  storyId,
  initialBookmarked = false,
  onBookmark,
  className,
  size = "sm",
  showLabel = false
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    try {
      if (onBookmark) {
        await onBookmark(storyId, newBookmarked);
      }
    } catch (error) {
      // Revert on error
      setBookmarked(bookmarked);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const sizes = {
    xs: "p-1 text-xs gap-1",
    sm: "p-2 text-sm gap-1.5",
    md: "p-2.5 text-base gap-2",
    lg: "p-3 text-lg gap-2"
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800",
        sizes[size],
        bookmarked ? "text-primary-500" : "text-gray-500 dark:text-slate-400 hover:text-primary-500",
        isAnimating && "transform scale-110",
        className
      )}
    >
      <ApperIcon 
        name="Bookmark"
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          bookmarked && "fill-current",
          isAnimating && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="font-medium">
          {bookmarked ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;