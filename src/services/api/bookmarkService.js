/**
 * Bookmark Service
 * Handles all bookmark-related operations
 */

// Mock data for bookmarks (in real app, this would be API calls)
const STORAGE_KEY = 'story_sphere_bookmarks';

// Initialize bookmarks from localStorage
const getStoredBookmarks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookmarks from storage:', error);
    return [];
  }
};

// Save bookmarks to localStorage
const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks to storage:', error);
  }
};

/**
 * Get all bookmarks for the current user
 * @param {string} userId - User ID to fetch bookmarks for
 * @returns {Promise<Array>} Array of bookmarked stories
 */
export const getUserBookmarks = async (userId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const bookmarks = getStoredBookmarks();
    const userBookmarks = bookmarks.filter(bookmark => bookmark.userId === userId);
    
    // Import storyService to get full story details
    const { getStoryById } = await import('./storyService');
    
    // Fetch full story details for each bookmark
    const bookmarkedStories = await Promise.all(
      userBookmarks.map(async (bookmark) => {
        const story = await getStoryById(bookmark.storyId);
        return story ? { ...story, bookmarkedAt: bookmark.createdAt } : null;
      })
    );
    
    // Filter out any null values (stories that couldn't be found)
    return bookmarkedStories.filter(story => story !== null);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw new Error('Failed to fetch bookmarks');
  }
};

/**
 * Add a story to bookmarks
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID to bookmark
 * @returns {Promise<Object>} Bookmark object
 */
export const addBookmark = async (userId, storyId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const bookmarks = getStoredBookmarks();
    
    // Check if already bookmarked
    const existingBookmark = bookmarks.find(
      b => b.userId === userId && b.storyId === storyId
    );
    
    if (existingBookmark) {
      return existingBookmark;
    }
    
    const newBookmark = {
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      storyId,
      createdAt: new Date().toISOString()
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
    
    return newBookmark;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error('Failed to add bookmark');
  }
};

/**
 * Remove a story from bookmarks
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID to remove from bookmarks
 * @returns {Promise<boolean>} Success status
 */
export const removeBookmark = async (userId, storyId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const bookmarks = getStoredBookmarks();
    const updatedBookmarks = bookmarks.filter(
      b => !(b.userId === userId && b.storyId === storyId)
    );
    
    saveBookmarks(updatedBookmarks);
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('Failed to remove bookmark');
  }
};

/**
 * Check if a story is bookmarked by user
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID to check
 * @returns {Promise<boolean>} True if bookmarked
 */
export const isBookmarked = async (userId, storyId) => {
  try {
    const bookmarks = getStoredBookmarks();
    return bookmarks.some(b => b.userId === userId && b.storyId === storyId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

/**
 * Get bookmark count for a story
 * @param {string} storyId - Story ID
 * @returns {Promise<number>} Number of bookmarks
 */
export const getBookmarkCount = async (storyId) => {
  try {
    const bookmarks = getStoredBookmarks();
    return bookmarks.filter(b => b.storyId === storyId).length;
  } catch (error) {
    console.error('Error getting bookmark count:', error);
    return 0;
  }
};

export const bookmarkService = {
  getUserBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmarkCount
};

export default bookmarkService;