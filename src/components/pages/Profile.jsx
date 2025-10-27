import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import StoryList from "@/components/organisms/StoryList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber, formatDate } from "@/utils/formatters";
import { userService } from "@/services/api/userService";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stories");
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: "1",
    username: "johndoe"
  };

  const isOwnProfile = currentUser.username === username;

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getByUsername(username);
      setUser(data);
      setIsFollowing(data.isFollowing || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [username]);

  const handleFollow = async () => {
    try {
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      
      if (user) {
        setUser(prev => ({
          ...prev,
          followerCount: prev.followerCount + (newFollowStatus ? 1 : -1)
        }));
      }
      
      // Here you would call the follow/unfollow API
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      if (user) {
        setUser(prev => ({
          ...prev,
          followerCount: prev.followerCount + (isFollowing ? 1 : -1)
        }));
      }
    }
  };

  const handleRetry = () => {
    loadUser();
  };

  const tabs = [
    { key: "stories", label: "Stories", icon: "BookOpen" },
    { key: "about", label: "About", icon: "User" }
  ];

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
            title="Profile not found"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar
              src={user.profilePicture}
              alt={user.name}
              fallback={user.name}
              size="2xl"
              className="mx-auto md:mx-0"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-2">
                {user.name}
              </h1>
              
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                @{user.username}
              </p>

              {user.bio && (
                <p className="text-gray-700 dark:text-slate-300 mb-6 leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {formatNumber(user.followerCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-500">
                    Followers
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {formatNumber(user.followingCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-500">
                    Following
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {formatNumber(user.storyCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-slate-500">
                    Stories
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    onClick={handleFollow}
                    icon={isFollowing ? "UserCheck" : "UserPlus"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                
                {isOwnProfile && (
                  <>
                    <Button
                      variant="primary"
                      icon="PenTool"
                      onClick={() => window.location.href = "/write"}
                    >
                      Write Story
                    </Button>
                    
                    <Button
                      variant="outline"
                      icon="Settings"
                      onClick={() => window.location.href = "/settings"}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  icon="Share"
                >
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex gap-1 mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex-1 ${
                  activeTab === tab.key
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "stories" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <StoryList
                  authorId={user.id}
                  filter="published"
                />
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-slate-700"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">
                      About {user.name}
                    </h3>
                    
                    {user.bio ? (
                      <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                        {user.bio}
                      </p>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-500 italic">
                        {isOwnProfile ? "Add a bio to tell people about yourself." : "This user hasn't added a bio yet."}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">
                      Member Information
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                        <ApperIcon name="MapPin" className="w-4 h-4" />
                        <span>{user.location || "Location not specified"}</span>
                      </div>
                      
                      {user.website && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                          <ApperIcon name="Link" className="w-4 h-4" />
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {user.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-3">
                      Statistics
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                          {formatNumber(user.totalViews || 0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">
                          Total Views
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                          {formatNumber(user.totalLikes || 0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">
                          Total Likes
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                          {formatNumber(user.totalComments || 0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">
                          Total Comments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;