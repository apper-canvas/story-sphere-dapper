import usersData from '@/services/mockData/users.json';

/**
 * User Service
 * Handles all user-related API operations including profiles, following, and user management
 */

// Simulated API delay for realistic behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects
 */
const getAll = async () => {
  try {
    await delay(300);
    
    if (!usersData || !Array.isArray(usersData)) {
      throw new Error('Invalid users data format');
    }
    
    return usersData.map(user => ({
      ...user,
      id: user.Id?.toString() || user.id?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users. Please try again later.');
  }
};

/**
 * Get user by username
 * @param {string} username - The username to search for
 * @returns {Promise<Object>} User object
 */
const getByUsername = async (username) => {
  try {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }
    
    await delay(400);
    
    if (!usersData || !Array.isArray(usersData)) {
      throw new Error('Invalid users data format');
    }
    
    const user = usersData.find(u => u?.username?.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      throw new Error(`User with username "${username}" not found`);
    }
    
    return {
      ...user,
      id: user.Id?.toString() || user.id?.toString(),
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string|number} userId - The user ID to search for
 * @returns {Promise<Object>} User object
 */
const getById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    await delay(400);
    
    if (!usersData || !Array.isArray(usersData)) {
      throw new Error('Invalid users data format');
    }
    
    const normalizedId = userId.toString();
    const user = usersData.find(u => {
      const uId = u?.Id?.toString() || u?.id?.toString();
      return uId === normalizedId;
    });
    
    if (!user) {
      throw new Error(`User with ID "${userId}" not found`);
    }
    
    return {
      ...user,
      id: user.Id?.toString() || user.id?.toString(),
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string|number} userId - The user ID to update
 * @param {Object} data - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
const updateProfile = async (userId, data) => {
  try {
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid profile data provided');
    }
    
    await delay(500);
    
    // In a real app, this would make an API call
    // For now, we'll just return the merged data
    const user = await getById(userId);
    
    return {
      ...user,
      ...data,
      id: userId.toString(),
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile. Please try again later.');
  }
};

/**
 * Follow a user
 * @param {string|number} userId - The ID of the user to follow
 * @returns {Promise<Object>} Success response
 */
const follow = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    await delay(300);
    
    // Verify user exists
    await getById(userId);
    
    return {
      success: true,
      message: 'Successfully followed user',
      userId: userId.toString(),
    };
  } catch (error) {
    console.error('Error following user:', error);
    throw new Error('Failed to follow user. Please try again later.');
  }
};

/**
 * Unfollow a user
 * @param {string|number} userId - The ID of the user to unfollow
 * @returns {Promise<Object>} Success response
 */
const unfollow = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Invalid user ID provided');
    }
    
    await delay(300);
    
    // Verify user exists
    await getById(userId);
    
    return {
      success: true,
      message: 'Successfully unfollowed user',
      userId: userId.toString(),
    };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw new Error('Failed to unfollow user. Please try again later.');
  }
};

export const userService = {
  getAll,
  getByUsername,
  getById,
  updateProfile,
  follow,
  unfollow,
};