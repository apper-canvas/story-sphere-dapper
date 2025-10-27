import { STORY_STATUS } from "@/utils/constants";
import React from "react";
import Error from "@/components/ui/Error";

const STORAGE_KEY = 'storySphere_stories';
const DRAFT_STORAGE_KEY = 'storySphere_draft_autosave';

// Helper to get all stories from localStorage
const getStoriesFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading stories from storage:', error);
    return [];
  }
};

// Helper to save stories to localStorage
const saveStoriesToStorage = (stories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (error) {
    console.error('Error saving stories to storage:', error);
    throw new Error('Failed to save story');
  }
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Generate unique ID
const generateId = () => {
  return `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

class StoryService {
  // Get story by ID
  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const stories = getStoriesFromStorage();
          const story = stories.find(s => s.id === id || s.slug === id);
          
          if (!story) {
            reject(new Error('Story not found'));
            return;
          }
          
          resolve(story);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

// Create new story
  async create(storyData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!storyData.title?.trim()) {
            reject(new Error('Story title is required'));
            return;
          }

          const stories = getStoriesFromStorage();
          const newStory = {
            ...storyData,
            id: generateId(),
            slug: generateSlug(storyData.title),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            views: 0,
            comments: [],
            bookmarked: false
          };

          stories.push(newStory);
          saveStoriesToStorage(stories);
          
          resolve(newStory);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Auto-save draft to local storage
async saveDraft(draftData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const draft = {
            ...draftData,
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
          resolve(draft);
        } catch (error) {
          console.error('Error saving draft to storage:', error);
          reject(new Error('Failed to auto-save draft'));
        }
      }, 100);
    });
  }

  // Get auto-saved draft from local storage
async getDraft() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(DRAFT_STORAGE_KEY);
          resolve(data ? JSON.parse(data) : null);
        } catch (error) {
          console.error('Error reading draft from storage:', error);
          resolve(null);
        }
      }, 100);
    });
  }
  // Clear auto-saved draft from local storage
async clearDraft() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          resolve();
        } catch (error) {
          console.error('Error clearing draft from storage:', error);
          resolve();
        }
      }, 100);
    });
  }

  // Update existing story
async update(id, storyData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const stories = getStoriesFromStorage();
          const index = stories.findIndex(s => s.id === id || s.slug === id);
          
          if (index === -1) {
            reject(new Error('Story not found'));
            return;
          }

          const updatedStory = {
            ...stories[index],
            ...storyData,
            slug: storyData.title ? generateSlug(storyData.title) : stories[index].slug,
            updatedAt: new Date().toISOString()
          };

          stories[index] = updatedStory;
          saveStoriesToStorage(stories);
          
          resolve(updatedStory);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Get all stories with optional filters
  async getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let stories = getStoriesFromStorage();

          // Apply filters
          if (filters.status) {
            stories = stories.filter(s => s.status === filters.status);
          }
          if (filters.category) {
            stories = stories.filter(s => s.category === filters.category);
          }
          if (filters.authorId) {
            stories = stories.filter(s => s.authorId === filters.authorId);
          }
          
          resolve(stories);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Delete story
  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const stories = getStoriesFromStorage();
          const filteredStories = stories.filter(s => s.id !== id && s.slug !== id);
          
          if (stories.length === filteredStories.length) {
            reject(new Error('Story not found'));
            return;
          }

          saveStoriesToStorage(filteredStories);
          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }
}

export const storyService = new StoryService();