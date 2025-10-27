import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { storyService } from "@/services/api/storyService";
import { isBookmarked } from "@/services/api/bookmarkService";
import ApperIcon from "@/components/ApperIcon";
import CommentSection from "@/components/organisms/CommentSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import BookmarkButton from "@/components/molecules/BookmarkButton";
import AuthorCard from "@/components/molecules/AuthorCard";
import TagChip from "@/components/molecules/TagChip";
import LikeButton from "@/components/molecules/LikeButton";
import { formatDate, formatNumber, formatReadTime } from "@/utils/formatters";

const StoryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);

  const loadStory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storyService.getBySlug(slug);
      setStory(data);
      setIsFollowing(data?.author?.isFollowing || false);
    } catch (err) {
      setError(err?.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadStory();
    }
  }, [slug]);

const handleFollow = async (authorId) => {
    if (followLoading || !authorId) return;
    
    try {
      setFollowLoading(true);
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      
      if (newFollowStatus) {
        await userService.follow(authorId);
        toast.success(`You are now following ${story?.author?.name || 'this author'}`);
      } else {
        await userService.unfollow(authorId);
        toast.success(`You unfollowed ${story?.author?.name || 'this author'}`);
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      toast.error(error?.message || 'Failed to update follow status');
      setIsFollowing(!isFollowing);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLike = async (storyId, liked) => {
    if (story) {
      setStory(prev => ({
        ...prev,
        isLiked: liked,
        likeCount: prev.likeCount + (liked ? 1 : -1)
      }));
    }
  };
  const handleBookmark = async (storyId, bookmarked) => {
    if (story) {
      setStory(prev => ({
        ...prev,
        isBookmarked: bookmarked
      }));
    }
  };

  const handleRetry = () => {
    loadStory();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error
            title="Story not found"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className={`min-h-screen ${isReaderMode ? "bg-amber-50 dark:bg-amber-950/20" : "bg-white dark:bg-slate-900"}`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reader Mode Toggle */}
        <div className="sticky top-20 z-40 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsReaderMode(!isReaderMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isReaderMode
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
              >
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                Reader Mode
              </button>
              
              <div className="flex items-center gap-2">
                <LikeButton
                  storyId={story.id}
                  initialLiked={story.isLiked}
                  initialCount={story.likeCount}
                  onLike={handleLike}
                  size="md"
                />
                
                <BookmarkButton
                  storyId={story.id}
                  initialBookmarked={story.isBookmarked}
                  onBookmark={handleBookmark}
                  size="md"
                  showLabel
                />
              </div>
            </div>
          </div>
        </div>

        <article className="py-8">
          {/* Cover Image */}
          {story.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-2xl"
            >
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {story.tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
              {story.title}
            </h1>

            {/* Subtitle */}
            {story.subtitle && (
              <h2 className="text-xl lg:text-2xl text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                {story.subtitle}
              </h2>
            )}

            {/* Author and Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
<AuthorCard
                author={story.author}
                publishDate={story.publishedAt}
                readTime={story.readTimeMinutes}
                variant="horizontal"
                showFollowButton={true}
                isFollowing={isFollowing}
                onFollowToggle={() => handleFollow(story?.author?.id)}
              />
              
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-500">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                  <span>{formatNumber(story.viewCount)} views</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{formatReadTime(story.readTimeMinutes)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>{formatDate(story.publishedAt)}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`prose prose-lg max-w-none ${isReaderMode ? "prose-amber" : ""}`}
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          {/* Engagement Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-between py-8 mt-12 border-t border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-6">
              <LikeButton
                storyId={story.id}
                initialLiked={story.isLiked}
                initialCount={story.likeCount}
                onLike={handleLike}
                size="lg"
              />
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-500">
                <ApperIcon name="MessageCircle" className="w-5 h-5" />
                <span className="font-medium">{formatNumber(story.commentCount)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-500">
                <ApperIcon name="Share" className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </div>
            </div>
            
            <BookmarkButton
              storyId={story.id}
              initialBookmarked={story.isBookmarked}
              onBookmark={handleBookmark}
              size="lg"
              showLabel
            />
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-8 mt-12"
          >
            <AuthorCard
              author={story.author}
              variant="vertical"
              showFollowButton={true}
            />
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16"
          >
            <CommentSection storyId={story.id} />
          </motion.div>
        </article>
      </div>
    </div>
  );
};

export default StoryDetail;