import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import SearchBar from "@/components/molecules/SearchBar";
import ThemeToggle from "@/components/molecules/ThemeToggle";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState([]); // Mock notifications
  const navigate = useNavigate();

  // Mock user - in real app this would come from auth context
  const user = {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    profilePicture: null
  };

  const handleWriteClick = () => {
    navigate("/write");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    // Handle logout
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-feed mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-serif font-bold text-gray-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
            </div>
            StorySphere
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <SearchBar className="w-80" />

            {/* Write Button */}
            <Button
              variant="primary"
              size="sm"
              icon="PenTool"
              onClick={handleWriteClick}
            >
              Write
            </Button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors">
              <ApperIcon name="Bell" className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  fallback={user.name}
                  size="sm"
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50"
                  >
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ApperIcon name="User" className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    
                    <Link
                      to="/bookmarks"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ApperIcon name="Bookmark" className="w-4 h-4 mr-3" />
                      Bookmarks
                    </Link>
                    
                    <Link
                      to="/analytics"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ApperIcon name="BarChart3" className="w-4 h-4 mr-3" />
                      Analytics
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ApperIcon name="Settings" className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <hr className="my-1 border-gray-200 dark:border-slate-700" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ApperIcon name="LogOut" className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4"
            >
              <div className="space-y-4">
                <SearchBar className="w-full" />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="primary"
                    size="sm"
                    icon="PenTool"
                    onClick={handleWriteClick}
                    className="flex-1 mr-2"
                  >
                    Write Story
                  </Button>
                  
                  <ThemeToggle />
                  
                  <button className="relative p-2 text-gray-500 dark:text-slate-400 ml-2">
                    <ApperIcon name="Bell" className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar
                      src={user.profilePicture}
                      alt={user.name}
                      fallback={user.name}
                      size="md"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center px-2 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ApperIcon name="User" className="w-5 h-5 mr-3" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/bookmarks"
                      className="flex items-center px-2 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ApperIcon name="Bookmark" className="w-5 h-5 mr-3" />
                      Bookmarks
                    </Link>
                    
                    <Link
                      to="/analytics"
                      className="flex items-center px-2 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ApperIcon name="BarChart3" className="w-5 h-5 mr-3" />
                      Analytics
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-2 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ApperIcon name="Settings" className="w-5 h-5 mr-3" />
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;