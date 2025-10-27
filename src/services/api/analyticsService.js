// Mock analytics data
const generateMockAnalytics = (timeRange) => {
  const now = Date.now();
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const days = daysMap[timeRange] || 30;
  
  // Generate time-series data for views chart
  const viewsData = [];
  for (let i = days; i >= 0; i--) {
    const date = now - (i * 24 * 60 * 60 * 1000);
    const views = Math.floor(Math.random() * 500) + 100;
    viewsData.push({ x: date, y: views });
  }
  
  return {
    totalViews: Math.floor(Math.random() * 50000) + 10000,
    viewsChange: Math.floor(Math.random() * 40) - 10,
    totalLikes: Math.floor(Math.random() * 5000) + 1000,
    likesChange: Math.floor(Math.random() * 50) - 15,
    totalComments: Math.floor(Math.random() * 2000) + 500,
    commentsChange: Math.floor(Math.random() * 45) - 12,
    totalFollowers: Math.floor(Math.random() * 10000) + 2000,
    followersChange: Math.floor(Math.random() * 35) - 8,
    totalBookmarks: Math.floor(Math.random() * 3000) + 800,
    viewsData,
    topStories: [
      {
        id: '1',
        title: 'The Future of Web Development in 2024',
        subtitle: 'Exploring emerging technologies and trends',
        publishedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 12543,
        likeCount: 856,
        commentCount: 134
      },
      {
        id: '2',
        title: 'Building Scalable React Applications',
        subtitle: 'Best practices and architectural patterns',
        publishedAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 9876,
        likeCount: 654,
        commentCount: 98
      },
      {
        id: '3',
        title: 'Understanding TypeScript Generics',
        subtitle: 'A comprehensive guide to advanced type systems',
        publishedAt: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 8234,
        likeCount: 521,
        commentCount: 76
      },
      {
        id: '4',
        title: 'CSS Grid vs Flexbox: When to Use What',
        subtitle: 'Modern layout techniques compared',
        publishedAt: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 7654,
        likeCount: 478,
        commentCount: 65
      },
      {
        id: '5',
        title: 'State Management in Modern React',
        subtitle: 'Redux, Context API, and beyond',
        publishedAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 6543,
        likeCount: 412,
        commentCount: 54
      }
    ]
  };
};

export const analyticsService = {
  getDashboard: async (timeRange = '30d') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockAnalytics(timeRange);
  }
};