// Mock comments data
const mockComments = [
  {
    id: "1",
    storyId: "1",
    content: "This is a fantastic story! The character development is exceptional and the plot twists kept me engaged throughout.",
    author: {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      profilePicture: null
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likeCount: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        storyId: "1",
        parentCommentId: "1",
        content: "I completely agree! The author has a unique voice.",
        author: {
          id: "3",
          name: "Mike Johnson",
          username: "mikej",
          profilePicture: null
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likeCount: 5,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: "2",
    storyId: "1",
    content: "Loved the imagery in this piece. Really transported me to another world.",
    author: {
      id: "4",
      name: "Sarah Williams",
      username: "sarahw",
      profilePicture: null
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likeCount: 8,
    isLiked: false,
    replies: []
  },
  {
    id: "3",
    storyId: "2",
    content: "The technical details are well-researched. Great work!",
    author: {
      id: "5",
      name: "Alex Brown",
      username: "alexb",
      profilePicture: null
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likeCount: 15,
    isLiked: true,
    replies: []
  }
];

let nextCommentId = 4;

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  // Get all comments for a story
  async getByStoryId(storyId) {
    await delay();
    return mockComments.filter(comment => comment.storyId === storyId && !comment.parentCommentId);
  },

  // Create a new comment or reply
  async create(commentData) {
    await delay();
    
    const newComment = {
      id: String(nextCommentId++),
      storyId: commentData.storyId,
      content: commentData.content,
      author: {
        id: commentData.userId,
        name: "Current User",
        username: "currentuser",
        profilePicture: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      replies: []
    };

    if (commentData.parentCommentId) {
      newComment.parentCommentId = commentData.parentCommentId;
    }

    mockComments.push(newComment);
    return newComment;
  },

  // Update a comment
  async update(commentId, updates) {
    await delay();
    
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    mockComments[commentIndex] = {
      ...mockComments[commentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return mockComments[commentIndex];
  },

  // Delete a comment
  async delete(commentId) {
    await delay();
    
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    mockComments.splice(commentIndex, 1);
    // Also delete replies
    const replyIndexes = mockComments
      .map((c, idx) => c.parentCommentId === commentId ? idx : -1)
      .filter(idx => idx !== -1)
      .reverse();
    
    replyIndexes.forEach(idx => mockComments.splice(idx, 1));
    
    return { success: true };
  },

  // Like/unlike a comment
  async like(commentId, liked) {
    await delay();
    
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const comment = mockComments[commentIndex];
    comment.isLiked = liked;
    comment.likeCount = Math.max(0, comment.likeCount + (liked ? 1 : -1));

    return comment;
  }
};