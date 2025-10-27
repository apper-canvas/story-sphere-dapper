import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import AuthorCard from "@/components/molecules/AuthorCard";
import TagChip from "@/components/molecules/TagChip";
import LikeButton from "@/components/molecules/LikeButton";
import BookmarkButton from "@/components/molecules/BookmarkButton";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber, truncateText, stripHtml } from "@/utils/formatters";

const StoryCard = ({ 
  story,
  variant = "default",
  className,
  onLike,
  onBookmark
}) => {
  const navigate = useNavigate();

  const handleStoryClick = () => {
    navigate(`/story/${story.slug}`);
  };

  const excerpt = truncateText(stripHtml(story.content), 150);

  if (variant === "featured") {
    return (
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer",
          className
        )}
        onClick={handleStoryClick}
      >
        {story.coverImage && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {story.tags?.slice(0, 2).map((tag) => (
                <TagChip key={tag.id} tag={tag} size="xs" />
              ))}
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {story.title}
            </h2>
            
            {story.subtitle && (
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                {story.subtitle}
              </p>
            )}
            
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <AuthorCard
              author={story.author}
              publishDate={story.publishedAt}
              readTime={story.readTimeMinutes}
              showFollowButton={false}
            />
            
            <div className="flex items-center gap-2">
              <LikeButton
                storyId={story.id}
                initialLiked={story.isLiked}
                initialCount={story.likeCount}
                onLike={onLike}
                size="sm"
              />
              
              <BookmarkButton
                storyId={story.id}
                initialBookmarked={story.isBookmarked}
                onBookmark={onBookmark}
                size="sm"
              />
              
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-500 ml-2">
                <ApperIcon name="MessageCircle" className="w-4 h-4" />
                <span>{formatNumber(story.commentCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex gap-4 p-6">
        <div className="flex-1 cursor-pointer" onClick={handleStoryClick}>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              {story.tags?.slice(0, 2).map((tag) => (
                <TagChip key={tag.id} tag={tag} size="xs" />
              ))}
            </div>
            
            <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {story.title}
            </h3>
            
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          </div>

          <AuthorCard
            author={story.author}
            publishDate={story.publishedAt}
            readTime={story.readTimeMinutes}
            showFollowButton={false}
          />
        </div>

        {story.coverImage && (
          <div className="w-32 h-32 flex-shrink-0 cursor-pointer" onClick={handleStoryClick}>
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600">
        <div className="flex items-center gap-4">
          <LikeButton
            storyId={story.id}
            initialLiked={story.isLiked}
            initialCount={story.likeCount}
            onLike={onLike}
            size="sm"
          />
          
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-500">
            <ApperIcon name="MessageCircle" className="w-4 h-4" />
            <span>{formatNumber(story.commentCount)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-500">
            <ApperIcon name="Eye" className="w-4 h-4" />
            <span>{formatNumber(story.viewCount)}</span>
          </div>
        </div>
        
        <BookmarkButton
          storyId={story.id}
          initialBookmarked={story.isBookmarked}
          onBookmark={onBookmark}
          size="sm"
        />
      </div>
    </motion.article>
  );
};

export default StoryCard;