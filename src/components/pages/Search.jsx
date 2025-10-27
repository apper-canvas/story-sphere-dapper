import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import StoryCard from "@/components/organisms/StoryCard";
import SearchBar from "@/components/molecules/SearchBar";
import TagChip from "@/components/molecules/TagChip";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { storyService } from "@/services/api/storyService";
import { STORY_CATEGORIES } from "@/utils/constants";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    { key: "all", label: "All", icon: "Search" },
    { key: "stories", label: "Stories", icon: "BookOpen" },
    { key: "authors", label: "Authors", icon: "Users" },
    { key: "tags", label: "Tags", icon: "Hash" }
  ];

  const searchStories = async (searchQuery, filter = "all", pageNum = 1, append = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      if (!append) {
        setLoading(true);
        setError(null);
      }

      const params = {
        q: searchQuery.trim(),
        filter,
        page: pageNum,
        limit: 10
      };

      const response = await storyService.search(params);
      
      if (append) {
        setResults(prev => [...prev, ...response]);
      } else {
        setResults(response);
      }
      
      setHasMore(response.length === 10);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      setPage(1);
      searchStories(searchQuery, activeFilter, 1, false);
    }
  }, [searchParams, activeFilter]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setSearchParams({ q: newQuery });
    searchStories(newQuery, activeFilter, 1, false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
    if (query) {
      searchStories(query, filter, 1, false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchStories(query, activeFilter, nextPage, true);
  };

  const handleTagSearch = (tag) => {
    const tagQuery = `#${tag.name}`;
    handleSearch(tagQuery);
  };

  const handleLike = async (storyId, liked) => {
    setResults(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isLiked: liked, likeCount: story.likeCount + (liked ? 1 : -1) }
        : story
    ));
  };

  const handleBookmark = async (storyId, bookmarked) => {
    setResults(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isBookmarked: bookmarked }
        : story
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-6">
            Search Stories
          </h1>
          
          <SearchBar
            placeholder="Search for stories, authors, or topics..."
            onSearch={handleSearch}
            className="mb-6"
          />

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeFilter === filter.key
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
                }`}
              >
                <ApperIcon name={filter.icon} className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search Summary */}
          {query && !loading && (
            <div className="text-gray-600 dark:text-slate-400 mb-6">
              {results.length > 0 ? (
                <span>Found {results.length} results for "{query}"</span>
              ) : (
                <span>No results found for "{query}"</span>
              )}
            </div>
          )}
        </motion.div>

        {/* Search Results */}
        {loading && results.length === 0 ? (
          <Loading variant="skeleton" />
        ) : error ? (
          <Error
            title="Search failed"
            message={error}
            onRetry={() => searchStories(query, activeFilter, 1, false)}
          />
        ) : !query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Popular Tags */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-slate-700 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                Popular Topics
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {STORY_CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleTagSearch(category)}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all group"
                  >
                    <ApperIcon name="Hash" className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 border border-blue-200 dark:border-slate-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Search Tips
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <ApperIcon name="Search" className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Search by keyword</div>
                    <div className="text-gray-600 dark:text-slate-400">
                      Find stories containing specific words or phrases
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ApperIcon name="User" className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Find authors</div>
                    <div className="text-gray-600 dark:text-slate-400">
                      Search for stories by specific authors
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ApperIcon name="Hash" className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Use hashtags</div>
                    <div className="text-gray-600 dark:text-slate-400">
                      Search with #tag to find topic-specific content
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ApperIcon name="Filter" className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Filter results</div>
                    <div className="text-gray-600 dark:text-slate-400">
                      Use filters to narrow down your search results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : results.length === 0 ? (
          <Empty
            title="No results found"
            message={`We couldn't find any ${activeFilter === "all" ? "content" : activeFilter} matching "${query}". Try adjusting your search terms or filters.`}
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => {
              setQuery("");
              setSearchParams({});
              setResults([]);
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {results.map((story, index) => (
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
                  loading={loading}
                  onClick={handleLoadMore}
                  icon="ChevronDown"
                >
                  Load More Results
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;