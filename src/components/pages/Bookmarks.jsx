import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StoryCard from "@/components/organisms/StoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { bookmarkService } from "@/services/api/bookmarkService";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookmarkService.getAll();
      setBookmarks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleLike = async (storyId, liked) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.story.id === storyId 
        ? { 
            ...bookmark, 
            story: { 
              ...bookmark.story, 
              isLiked: liked, 
              likeCount: bookmark.story.likeCount + (liked ? 1 : -1) 
            }
          }
        : bookmark
    ));
  };

  const handleBookmark = async (storyId, bookmarked) => {
    if (!bookmarked) {
      // Remove from bookmarks list
      setBookmarks(prev => prev.filter(bookmark => bookmark.story.id !== storyId));
    }
  };

  const handleRetry = () => {
    loadBookmarks();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading variant="skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error
            title="Failed to load bookmarks"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bookmark" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100">
                Your Reading List
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                {bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"} saved for later
              </p>
            </div>
          </div>

          {bookmarks.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Reading List Tips</p>
                  <p>Stories you bookmark are saved here for easy access. You can read them anytime, even when you're offline on our mobile app.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <Empty
            title="No bookmarks yet"
            message="Start bookmarking stories you want to read later. Look for the bookmark icon on any story card or story page."
            icon="Bookmark"
            actionLabel="Discover Stories"
            onAction={() => window.location.href = "/"}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1
                }}
              >
                <StoryCard
                  story={{
                    ...bookmark.story,
                    isBookmarked: true // Always true for bookmarks page
                  }}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;