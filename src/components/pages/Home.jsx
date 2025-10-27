import { useState } from "react";
import { motion } from "framer-motion";
import StoryList from "@/components/organisms/StoryList";
import SearchBar from "@/components/molecules/SearchBar";
import TagChip from "@/components/molecules/TagChip";
import ApperIcon from "@/components/ApperIcon";
import { STORY_CATEGORIES } from "@/utils/constants";

const Home = () => {
  const [activeFilter, setActiveFilter] = useState("trending");
  const [selectedTag, setSelectedTag] = useState(null);

  const filters = [
    { key: "trending", label: "Trending", icon: "TrendingUp" },
    { key: "following", label: "Following", icon: "Users" },
    { key: "recent", label: "Recent", icon: "Clock" },
    { key: "featured", label: "Featured", icon: "Star" }
  ];

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setActiveFilter("tag");
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter !== "tag") {
      setSelectedTag(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join a community of writers and readers sharing incredible stories, insights, and ideas that matter.
            </p>

            <SearchBar
              variant="hero"
              className="max-w-md mx-auto mb-8"
              placeholder="Search for stories, authors, or topics..."
            />

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/write"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 gap-3"
              >
                <ApperIcon name="PenTool" className="w-5 h-5" />
                Start Writing
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 gap-3"
              >
                <ApperIcon name="BookOpen" className="w-5 h-5" />
                Explore Stories
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-feed mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    activeFilter === filter.key
                      ? "bg-primary-500 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
                  }`}
                >
                  <ApperIcon name={filter.icon} className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Selected Tag */}
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <span>Stories tagged with</span>
                  <TagChip tag={selectedTag} clickable={false} />
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setActiveFilter("trending");
                    }}
                    className="text-primary-600 dark:text-primary-400 hover:underline ml-2"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stories */}
            <StoryList
              filter={activeFilter}
              tagId={selectedTag?.id}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Popular Tags */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Popular Topics
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {STORY_CATEGORIES.slice(0, 8).map((category) => (
                    <TagChip
                      key={category.slug}
                      tag={category}
                      onClick={handleTagSelect}
                      className="hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>

              {/* Trending Authors */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Trending Authors
                </h3>
                
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", username: "sarahj", followers: "12K", avatar: null },
                    { name: "Alex Chen", username: "alexchen", followers: "8.5K", avatar: null },
                    { name: "Maria Garcia", username: "mariag", followers: "6.2K", avatar: null }
                  ].map((author) => (
                    <div key={author.username} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm">
                          {author.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                            {author.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-500">
                            {author.followers} followers
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reading List */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Your Reading List
                  </h3>
                  <ApperIcon name="Bookmark" className="w-5 h-5 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                  Save stories to read later
                </p>
                
                <button className="w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  View all bookmarks →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;