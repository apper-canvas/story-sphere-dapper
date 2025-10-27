import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import TagChip from "@/components/molecules/TagChip";
import RichTextEditor from "@/components/organisms/RichTextEditor";
import ApperIcon from "@/components/ApperIcon";
import { STORY_CATEGORIES, STORY_STATUS } from "@/utils/constants";
import { storyService } from "@/services/api/storyService";
import { calculateReadTime } from "@/utils/formatters";

const Write = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(storyId);

  const [story, setStory] = useState({
    title: "",
    subtitle: "",
    content: "",
    coverImage: "",
    tags: [],
    status: STORY_STATUS.DRAFT
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (story.title || story.content) {
      const timer = setTimeout(() => {
        handleSave(true); // Auto-save as draft
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [story.title, story.content]);

  // Load existing story for editing
  useEffect(() => {
    if (isEditing && storyId) {
      loadStory();
    }
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const data = await storyService.getById(storyId);
      setStory(data);
    } catch (error) {
      toast.error("Failed to load story");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isDraft = true) => {
    if (!story.title.trim() && !story.content.trim()) return;

    try {
      setSaving(true);
      const storyData = {
        ...story,
        status: isDraft ? STORY_STATUS.DRAFT : STORY_STATUS.PUBLISHED,
        readTimeMinutes: calculateReadTime(story.content)
      };

      let savedStory;
      if (isEditing) {
        savedStory = await storyService.update(storyId, storyData);
      } else {
        savedStory = await storyService.create(storyData);
      }

      setStory(savedStory);
      setLastSaved(new Date());
      
      if (!isDraft) {
        toast.success("Story published successfully!");
        navigate(`/story/${savedStory.slug}`);
      } else {
        toast.success("Draft saved");
      }
    } catch (error) {
      toast.error("Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (!story.title.trim()) {
      toast.error("Please add a title");
      return;
    }
    if (!story.content.trim()) {
      toast.error("Please add content");
      return;
    }
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    setShowPublishModal(false);
    handleSave(false);
  };

  const addTag = (tag) => {
    if (!story.tags.find(t => t.id === tag.id)) {
      setStory(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setShowTagSelector(false);
  };

  const removeTag = (tagId) => {
    setStory(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t.id !== tagId)
    }));
  };

  const handleImageUpload = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setStory(prev => ({ ...prev, coverImage: url }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin mb-4 mx-auto">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-slate-400">Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  {isEditing ? "Edit Story" : "Write New Story"}
                </h1>
                {lastSaved && (
                  <p className="text-sm text-gray-500 dark:text-slate-500">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => handleSave(true)}
                loading={saving}
                icon="Save"
              >
                Save Draft
              </Button>
              
              <Button
                variant="primary"
                onClick={handlePublish}
                icon="Send"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Cover Image */}
          <div className="space-y-4">
            {story.coverImage ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={story.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setStory(prev => ({ ...prev, coverImage: "" }))}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleImageUpload}
                className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center text-gray-500 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all group"
              >
                <ApperIcon name="ImagePlus" className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium">Add cover image</span>
                <span className="text-sm">Make your story stand out</span>
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <Input
              value={story.title}
              onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Story title"
              className="text-4xl font-serif font-bold border-none p-0 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-0 bg-transparent"
            />
          </div>

          {/* Subtitle */}
          <div>
            <Input
              value={story.subtitle}
              onChange={(e) => setStory(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Add a subtitle (optional)"
              className="text-xl text-gray-600 dark:text-slate-400 border-none p-0 placeholder-gray-400 dark:placeholder-slate-500 focus:ring-0 bg-transparent"
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <div key={tag.id} className="relative group">
                  <TagChip tag={tag} clickable={false} />
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="inline-flex items-center gap-1 px-3 py-1 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-full text-gray-500 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ApperIcon name="Plus" className="w-3 h-3" />
                Add tag
              </button>
            </div>

            {showTagSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4"
              >
                <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">
                  Select tags for your story:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {STORY_CATEGORIES.map((category) => (
                    <TagChip
                      key={category.slug}
                      tag={category}
                      onClick={addTag}
                      className="hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <RichTextEditor
              value={story.content}
              onChange={(content) => setStory(prev => ({ ...prev, content }))}
              placeholder="Tell your story..."
              showToolbar={true}
            />
          </div>
        </motion.div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Send" className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                Ready to publish?
              </h3>
              
              <p className="text-gray-600 dark:text-slate-400">
                Your story will be visible to all readers on StorySphere.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowPublishModal(false)}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmPublish}
                icon="Check"
              >
                Publish Story
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Write;