import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber } from "@/utils/formatters";

const LikeButton = ({ 
  storyId,
  initialLiked = false,
  initialCount = 0,
  onLike,
  className,
  size = "sm"
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    
    setLiked(newLiked);
    setCount(newCount);

    try {
      if (onLike) {
        await onLike(storyId, newLiked);
      }
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setCount(count);
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
        liked ? "text-red-500" : "text-gray-500 dark:text-slate-400 hover:text-red-500",
        isAnimating && "transform scale-110",
        className
      )}
    >
      <ApperIcon 
        name={liked ? "Heart" : "Heart"}
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          liked && "fill-current",
          isAnimating && "animate-pulse"
        )}
      />
      {count > 0 && (
        <span className="font-medium">
          {formatNumber(count)}
        </span>
      )}
    </button>
  );
};

export default LikeButton;