const STORAGE_KEY = 'story-sphere-tags';

// Get tags from localStorage
function getTagsFromStorage() {
  const tags = localStorage.getItem(STORAGE_KEY);
  if (!tags) {
    // Initialize with default tags
    const defaultTags = [
      {
        id: '1',
        name: 'Technology',
        slug: 'technology',
        description: 'Latest in tech, software, and innovation',
        color: 'technology',
        storyCount: 0,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Design',
        slug: 'design',
        description: 'UI/UX, graphic design, and creative arts',
        color: 'design',
        storyCount: 0,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Business',
        slug: 'business',
        description: 'Entrepreneurship, startups, and business insights',
        color: 'business',
        storyCount: 0,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Science',
        slug: 'science',
        description: 'Scientific discoveries and research',
        color: 'science',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Health',
        slug: 'health',
        description: 'Wellness, fitness, and healthcare',
        color: 'health',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Travel',
        slug: 'travel',
        description: 'Adventures, destinations, and travel tips',
        color: 'travel',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Food',
        slug: 'food',
        description: 'Recipes, restaurants, and culinary experiences',
        color: 'food',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Life tips, personal development, and culture',
        color: 'lifestyle',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Politics',
        slug: 'politics',
        description: 'Political analysis and current affairs',
        color: 'politics',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Movies, music, TV, and pop culture',
        color: 'entertainment',
        storyCount: 0,
        featured: false,
        createdAt: new Date().toISOString()
      }
    ];
    saveTagsToStorage(defaultTags);
    return defaultTags;
  }
  return JSON.parse(tags);
}

// Save tags to localStorage
function saveTagsToStorage(tags) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

// Generate slug from tag name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class TagService {
  // Get tag by ID
  async getById(id) {
    const tags = getTagsFromStorage();
    const tag = tags.find(t => t.id === id);
    if (!tag) {
      throw new Error('Tag not found');
    }
    return tag;
  }

  // Get tag by slug
  async getBySlug(slug) {
    const tags = getTagsFromStorage();
    const tag = tags.find(t => t.slug === slug);
    if (!tag) {
      throw new Error('Tag not found');
    }
    return tag;
  }

  // Create new tag
  async create(tagData) {
    const tags = getTagsFromStorage();
    
    // Validate required fields
    if (!tagData.name) {
      throw new Error('Tag name is required');
    }

    // Generate slug from name
    const slug = generateSlug(tagData.name);
    
    // Check for duplicate slug
    if (tags.some(t => t.slug === slug)) {
      throw new Error('A tag with this name already exists');
    }

    const newTag = {
      id: generateId(),
      name: tagData.name.trim(),
      slug,
      description: tagData.description || '',
      color: tagData.color || 'technology',
      storyCount: 0,
      featured: tagData.featured || false,
      createdAt: new Date().toISOString()
    };

    tags.push(newTag);
    saveTagsToStorage(tags);
    return newTag;
  }

  // Update existing tag
  async update(id, tagData) {
    const tags = getTagsFromStorage();
    const index = tags.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Tag not found');
    }

    const existingTag = tags[index];
    
    // If name is being updated, regenerate slug
    let slug = existingTag.slug;
    if (tagData.name && tagData.name !== existingTag.name) {
      slug = generateSlug(tagData.name);
      // Check for duplicate slug
      if (tags.some((t, i) => t.slug === slug && i !== index)) {
        throw new Error('A tag with this name already exists');
      }
    }

    const updatedTag = {
      ...existingTag,
      ...tagData,
      slug,
      id: existingTag.id, // Preserve ID
      storyCount: existingTag.storyCount, // Preserve story count
      createdAt: existingTag.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    tags[index] = updatedTag;
    saveTagsToStorage(tags);
    return updatedTag;
  }

  // Get all tags with optional filters
  async getAll(filters = {}) {
    let tags = getTagsFromStorage();

    // Filter by featured
    if (filters.featured !== undefined) {
      tags = tags.filter(t => t.featured === filters.featured);
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      tags = tags.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Sort by story count or name
    const sortBy = filters.sortBy || 'storyCount';
    tags.sort((a, b) => {
      if (sortBy === 'storyCount') {
        return b.storyCount - a.storyCount;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    // Apply pagination
    if (filters.limit) {
      const page = filters.page || 1;
      const start = (page - 1) * filters.limit;
      const end = start + filters.limit;
      return {
        tags: tags.slice(start, end),
        total: tags.length,
        page,
        totalPages: Math.ceil(tags.length / filters.limit)
      };
    }

    return tags;
  }

  // Get popular tags (by story count)
  async getPopular(limit = 10) {
    const tags = getTagsFromStorage();
    return tags
      .filter(t => t.storyCount > 0)
      .sort((a, b) => b.storyCount - a.storyCount)
      .slice(0, limit);
  }

  // Delete tag
  async delete(id) {
    const tags = getTagsFromStorage();
    const index = tags.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Tag not found');
    }

    const deletedTag = tags[index];
    tags.splice(index, 1);
    saveTagsToStorage(tags);
    return deletedTag;
  }

  // Increment story count for a tag
  async incrementStoryCount(tagId) {
    const tags = getTagsFromStorage();
    const tag = tags.find(t => t.id === tagId);
    
    if (tag) {
      tag.storyCount = (tag.storyCount || 0) + 1;
      saveTagsToStorage(tags);
    }
    
    return tag;
  }

  // Decrement story count for a tag
  async decrementStoryCount(tagId) {
    const tags = getTagsFromStorage();
    const tag = tags.find(t => t.id === tagId);
    
    if (tag && tag.storyCount > 0) {
      tag.storyCount -= 1;
      saveTagsToStorage(tags);
    }
    
    return tag;
  }
}

export const tagService = new TagService();