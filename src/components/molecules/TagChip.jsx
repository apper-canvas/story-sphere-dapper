import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const TagChip = ({ 
  tag,
  variant = "default",
  size = "sm",
  clickable = true,
  className,
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    } else if (clickable && tag.slug) {
      navigate(`/tags/${tag.slug}`);
    }
  };

  const tagColors = {
    technology: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    design: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    business: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    science: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    health: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
    travel: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    food: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    lifestyle: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
    politics: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    entertainment: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
  };

  const colorClass = tagColors[tag.slug] || tagColors.technology;

  return (
    <Badge
      size={size}
      className={cn(
        colorClass,
        clickable && "cursor-pointer hover:opacity-80 transition-all duration-200 transform hover:scale-105",
        className
      )}
      onClick={clickable ? handleClick : undefined}
      {...props}
    >
      #{tag.name}
    </Badge>
  );
};

export default TagChip;