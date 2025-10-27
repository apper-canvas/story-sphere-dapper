import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    profilePicture: ""
  });

  const [notifications, setNotifications] = useState({
    emailOnComment: true,
    emailOnLike: false,
    emailOnFollow: true,
    emailNewsletter: true,
    pushNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    allowComments: true,
    allowFollowers: true
  });

  const tabs = [
    { key: "profile", label: "Profile", icon: "User" },
    { key: "account", label: "Account", icon: "Settings" },
    { key: "notifications", label: "Notifications", icon: "Bell" },
    { key: "privacy", label: "Privacy", icon: "Shield" },
    { key: "appearance", label: "Appearance", icon: "Palette" }
  ];

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getCurrentUser();
      setProfile({
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        profilePicture: data.profilePicture || ""
      });
      
      // Mock settings data
      setNotifications(data.notifications || notifications);
      setPrivacy(data.privacy || privacy);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await userService.updateProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await userService.updateNotifications(notifications);
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update notifications");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSaving(true);
      await userService.updatePrivacy(privacy);
      toast.success("Privacy settings updated!");
    } catch (error) {
      toast.error("Failed to update privacy settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = () => {
    const url = prompt("Enter profile image URL:");
    if (url) {
      setProfile(prev => ({ ...prev, profilePicture: url }));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      const doubleConfirmed = confirm(
        "This will permanently delete all your stories, comments, and data. Type 'DELETE' to confirm."
      );
      
      if (doubleConfirmed) {
        try {
          setSaving(true);
          await userService.deleteAccount();
          toast.success("Account deleted successfully");
          // Redirect to home
          window.location.href = "/";
        } catch (error) {
          toast.error("Failed to delete account");
        } finally {
          setSaving(false);
        }
      }
    }
  };

  const handleRetry = () => {
    loadSettings();
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
            title="Failed to load settings"
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
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage your account preferences and privacy settings
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Profile Information
                    </h2>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 mb-6">
                      <Avatar
                        src={profile.profilePicture}
                        alt={profile.name}
                        fallback={profile.name}
                        size="xl"
                      />
                      
                      <div>
                        <Button
                          variant="outline"
                          onClick={handleImageUpload}
                          icon="Camera"
                        >
                          Change Photo
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">
                          JPG, GIF or PNG. Max size of 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      
                      <Input
                        label="Username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        required
                      />
                      
                      <Input
                        label="Location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. New York, NY"
                      />
                      
                      <Input
                        label="Website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <Textarea
                      label="Bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell people about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      loading={saving}
                      onClick={handleSaveProfile}
                      icon="Save"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Account Settings
                    </h2>

                    <div className="space-y-6">
                      <Input
                        label="Email Address"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      
                      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Change Password
                        </h3>
                        
                        <div className="space-y-4">
                          <Input
                            label="Current Password"
                            type="password"
                            placeholder="Enter current password"
                          />
                          
                          <Input
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                          />
                          
                          <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <Button
                          variant="outline"
                          className="mt-4"
                          icon="Lock"
                        >
                          Update Password
                        </Button>
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                          Danger Zone
                        </h3>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                Delete Account
                              </h4>
                              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                Once you delete your account, there is no going back. This will permanently delete all your stories, comments, and data.
                              </p>
                              
                              <Button
                                variant="danger"
                                onClick={handleDeleteAccount}
                                loading={saving}
                                icon="Trash"
                              >
                                Delete My Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Email Notifications
                        </h3>
                        
                        <div className="space-y-4">
                          {[
                            { key: "emailOnComment", label: "New comments on my stories", description: "Get notified when someone comments on your stories" },
                            { key: "emailOnLike", label: "Likes on my stories", description: "Get notified when someone likes your stories" },
                            { key: "emailOnFollow", label: "New followers", description: "Get notified when someone follows you" },
                            { key: "emailNewsletter", label: "Weekly newsletter", description: "Receive our weekly digest of trending stories" }
                          ].map((item) => (
                            <div key={item.key} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={notifications[item.key]}
                                  onChange={(e) => setNotifications(prev => ({
                                    ...prev,
                                    [item.key]: e.target.checked
                                  }))}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                              </label>
                              
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-slate-100">
                                  {item.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-slate-400">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      loading={saving}
                      onClick={handleSaveNotifications}
                      icon="Save"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Privacy Settings
                    </h2>

                    <div className="space-y-4">
                      {[
                        { key: "profilePublic", label: "Public Profile", description: "Make your profile visible to everyone" },
                        { key: "showEmail", label: "Show Email", description: "Display your email address on your profile" },
                        { key: "allowComments", label: "Allow Comments", description: "Let readers comment on your stories" },
                        { key: "allowFollowers", label: "Allow Followers", description: "Let people follow your account" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={privacy[item.key]}
                              onChange={(e) => setPrivacy(prev => ({
                                ...prev,
                                [item.key]: e.target.checked
                              }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-slate-100">
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      loading={saving}
                      onClick={handleSavePrivacy}
                      icon="Save"
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Appearance
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Theme Preference
                        </h3>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-slate-100">
                              Dark Mode
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              Toggle between light and dark themes
                            </div>
                          </div>
                          
                          <ThemeToggle />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                          Reading Preferences
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-slate-100">
                                Large Text
                              </div>
                              <div className="text-sm text-gray-500 dark:text-slate-400">
                                Increase text size for better readability
                              </div>
                            </div>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-slate-100">
                                Reader Mode by Default
                              </div>
                              <div className="text-sm text-gray-500 dark:text-slate-400">
                                Always open stories in distraction-free reader mode
                              </div>
                            </div>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;