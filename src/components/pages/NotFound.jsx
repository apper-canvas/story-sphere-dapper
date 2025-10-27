import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="BookOpen" className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-4">
            404
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-4">
          Story Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
          The story you're looking for seems to have wandered off into the digital ether. 
          Let's get you back to discovering amazing stories.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            icon="Home"
          >
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">
            Looking for something specific?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
            <button
              onClick={() => navigate("/search")}
              className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
              Search Stories
            </button>
            
            <span className="hidden sm:inline text-gray-300 dark:text-slate-600">|</span>
            
            <button
              onClick={() => navigate("/write")}
              className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ApperIcon name="PenTool" className="w-4 h-4" />
              Write a Story
            </button>
            
            <span className="hidden sm:inline text-gray-300 dark:text-slate-600">|</span>
            
            <button
              onClick={() => navigate("/profile/johndoe")}
              className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ApperIcon name="User" className="w-4 h-4" />
              Your Profile
            </button>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
          <div className="flex items-start gap-3">
            <ApperIcon name="Quote" className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-gray-700 dark:text-slate-300 italic mb-2">
                "Every story has an ending, but in life, every ending is just a new beginning."
              </p>
              <p className="text-gray-500 dark:text-slate-500">
                — StorySphere Community
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;