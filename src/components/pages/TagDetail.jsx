import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import StoryList from "@/components/organisms/StoryList";
import TagChip from "@/components/molecules/TagChip";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber } from "@/utils/formatters";
import { tagService } from "@/services/api/tagService";

const TagDetail = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const loadTag = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagService.getBySlug(slug);
      setTag(data);
      setIsFollowing(data.isFollowing || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTag();
  }, [slug]);

  const handleFollowTag = async () => {
    try {
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      
      if (tag) {
        setTag(prev => ({
          ...prev,
          followerCount: prev.followerCount + (newFollowStatus ? 1 : -1)
        }));
      }
      
      // Here you would call the follow/unfollow tag API
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      if (tag) {
        setTag(prev => ({
          ...prev,
          followerCount: prev.followerCount + (isFollowing ? 1 : -1)
        }));
      }
    }
  };

  const handleRetry = () => {
    loadTag();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error
            title="Tag not found"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  if (!tag) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tag Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-slate-700"
        >
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-2xl flex items-center justify-center">
                <ApperIcon name="Hash" className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <div className="mb-6">
              <TagChip 
                tag={tag} 
                size="lg"
                clickable={false}
                className="mb-4 text-lg px-6 py-3"
              />
            </div>
            
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-4">
              {tag.name} Stories
            </h1>
            
            {tag.description && (
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                {tag.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {formatNumber(tag.storyCount)}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500">
                  Stories
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {formatNumber(tag.followerCount || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500">
                  Followers
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {formatNumber(tag.totalViews || 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500">
                  Views
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleFollowTag}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                <ApperIcon name={isFollowing ? "Check" : "Plus"} className="w-4 h-4" />
                {isFollowing ? "Following" : "Follow Tag"}
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 font-medium transition-colors">
                <ApperIcon name="Share" className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Tags */}
        {tag.relatedTags && tag.relatedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Related Topics
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {tag.relatedTags.map((relatedTag) => (
                <TagChip
                  key={relatedTag.id}
                  tag={relatedTag}
                  className="hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-slate-100">
                Latest Stories in #{tag.name}
              </h2>
              
              <div className="text-sm text-gray-500 dark:text-slate-500">
                {formatNumber(tag.storyCount)} stories found
              </div>
            </div>
          </div>

          <StoryList
            tagId={tag.id}
            filter="published"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TagDetail;