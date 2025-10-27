import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { formatDate } from "@/utils/formatters";

const AuthorCard = ({ 
  author,
  publishDate,
  readTime,
  showFollowButton = true,
  isFollowing = false,
  variant = "horizontal",
  className,
  onFollow,
  onFollowToggle
}) => {
  const navigate = useNavigate();
  
  // Validate author prop to prevent null/undefined access errors
  if (!author) {
    return null;
  }

  const handleAuthorClick = () => {
    navigate(`/profile/${author.username}`);
  };

const handleFollowClick = async () => {
    if (onFollowToggle) {
      await onFollowToggle();
    } else if (onFollow) {
      await onFollow(author.Id);
    }
  };

  if (variant === "vertical") {
    return (
      <div className={cn("text-center space-y-4", className)}>
        <Avatar
          src={author.profilePicture}
          alt={author.name}
          fallback={author.name}
          size="2xl"
          className="mx-auto cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={handleAuthorClick}
        />
        
        <div className="space-y-2">
          <h3 
            onClick={handleAuthorClick}
            className="text-xl font-semibold text-gray-900 dark:text-slate-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {author.name}
          </h3>
          
          {author.bio && (
            <p className="text-gray-600 dark:text-slate-400 text-sm max-w-xs mx-auto">
              {author.bio}
            </p>
          )}
          
          <div className="text-sm text-gray-500 dark:text-slate-500 space-y-1">
            {publishDate && (
              <div>{formatDate(publishDate)}</div>
            )}
            {readTime && (
              <div>{readTime} min read</div>
            )}
          </div>
        </div>

{showFollowButton && (
          <Button
            variant={isFollowing ? "outline" : "primary"}
            size="sm"
            onClick={handleFollowClick}
            icon={isFollowing ? "UserCheck" : "UserPlus"}
            className="group"
          >
            <span className={isFollowing ? "group-hover:hidden" : ""}>
              {isFollowing ? "Following" : "Follow"}
            </span>
            {isFollowing && (
              <span className="hidden group-hover:inline">Unfollow</span>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar
        src={author.profilePicture}
        alt={author.name}
        fallback={author.name}
        size="md"
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={handleAuthorClick}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 
            onClick={handleAuthorClick}
            className="text-sm font-medium text-gray-900 dark:text-slate-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate"
          >
            {author.name}
          </h4>
          
{showFollowButton && (
            <Button
              variant={isFollowing ? "ghost" : "ghost"}
              size="xs"
              onClick={handleFollowClick}
              className={cn(
                "text-xs group",
                isFollowing && "text-primary-600 dark:text-primary-400"
              )}
            >
              <span className={isFollowing ? "group-hover:hidden" : ""}>
                {isFollowing ? "Following" : "Follow"}
              </span>
              {isFollowing && (
                <span className="hidden group-hover:inline">Unfollow</span>
              )}
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
          {publishDate && (
            <>
              <span>{formatDate(publishDate)}</span>
              {readTime && <span>•</span>}
            </>
          )}
          {readTime && (
            <span>{readTime} min read</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;