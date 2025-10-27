import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StoryCard from "@/components/organisms/StoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { storyService } from "@/services/api/storyService";

const StoryList = ({ 
  filter = "all",
  authorId = null,
  tagId = null,
  className
}) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadStories = async (pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 10,
        filter,
        authorId,
        tagId
      };

      const response = await storyService.getAll(params);
      
      if (append) {
        setStories(prev => [...prev, ...response]);
      } else {
        setStories(response);
      }
      
      setHasMore(response.length === 10);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadStories(1, false);
  }, [filter, authorId, tagId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadStories(nextPage, true);
  };

  const handleLike = async (storyId, liked) => {
    // Mock like functionality
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isLiked: liked, likeCount: story.likeCount + (liked ? 1 : -1) }
        : story
    ));
  };

  const handleBookmark = async (storyId, bookmarked) => {
    // Mock bookmark functionality
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: bookmarked }
        : story
    ));
  };

  const handleRetry = () => {
    setPage(1);
    loadStories(1, false);
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load stories"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (stories.length === 0) {
    return (
      <Empty
        title="No stories found"
        message={
          filter === "following"
            ? "Follow some writers to see their stories here."
            : tagId
            ? "No stories found for this tag yet."
            : "Be the first to share your story!"
        }
        icon="BookOpen"
        actionLabel="Write a Story"
        onAction={() => window.location.href = "/write"}
      />
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.1
            }}
          >
            <StoryCard
              story={story}
              variant={index === 0 ? "featured" : "default"}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            size="lg"
            loading={loadingMore}
            onClick={handleLoadMore}
            icon="ChevronDown"
          >
            Load More Stories
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryList;