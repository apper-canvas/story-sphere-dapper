import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import StoryList from "@/components/organisms/StoryList";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "All Stories", icon: "BookOpen" },
    { id: "trending", label: "Trending", icon: "TrendingUp" },
    { id: "latest", label: "Latest", icon: "Clock" },
    { id: "popular", label: "Popular", icon: "Star" }
  ];

  const categories = [
    { id: "technology", label: "Technology", color: "bg-blue-500" },
    { id: "business", label: "Business", color: "bg-green-500" },
    { id: "health", label: "Health", color: "bg-red-500" },
    { id: "lifestyle", label: "Lifestyle", color: "bg-purple-500" },
    { id: "entertainment", label: "Entertainment", color: "bg-yellow-500" }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700">
        <div className="max-w-feed mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Explore Stories
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover amazing stories from writers around the world. Filter by category, search, or explore trending content.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500"
              />
              <Input
                type="text"
                placeholder="Search stories by title or content..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-12 pr-4 py-3 w-full bg-white dark:bg-slate-800 border-0 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="max-w-feed mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              )}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                )}
              >
                {category.label}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </motion.div>

        {/* Story List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StoryList
            filter={activeTab}
            category={selectedCategory}
            searchQuery={searchQuery}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;