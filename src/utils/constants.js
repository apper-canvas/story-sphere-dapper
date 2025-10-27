export const THEME = {
  LIGHT: "light",
  DARK: "dark"
};

export const STORY_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published"
};

export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  STORY_PUBLISHED: "story_published"
};

export const STORAGE_KEYS = {
  THEME: "storysphere_theme",
  USER: "storysphere_user",
  AUTH_TOKEN: "storysphere_token"
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh"
  },
  USERS: "/users",
  STORIES: "/stories",
  COMMENTS: "/comments",
  TAGS: "/tags",
  BOOKMARKS: "/bookmarks",
  LIKES: "/likes",
  FOLLOWS: "/follows"
};

export const PAGINATION = {
  STORIES_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 20
};

export const EDITOR_TOOLS = [
  { name: "bold", icon: "Bold", shortcut: "Ctrl+B" },
  { name: "italic", icon: "Italic", shortcut: "Ctrl+I" },
  { name: "underline", icon: "Underline", shortcut: "Ctrl+U" },
  { name: "heading1", icon: "Heading1", shortcut: "Ctrl+1" },
  { name: "heading2", icon: "Heading2", shortcut: "Ctrl+2" },
  { name: "quote", icon: "Quote", shortcut: "Ctrl+Q" },
  { name: "list", icon: "List", shortcut: "Ctrl+L" },
  { name: "numberedList", icon: "ListOrdered", shortcut: "Ctrl+Shift+L" },
  { name: "link", icon: "Link", shortcut: "Ctrl+K" },
  { name: "image", icon: "Image", shortcut: "Ctrl+M" }
];

export const STORY_CATEGORIES = [
  { name: "Technology", color: "blue", slug: "technology" },
  { name: "Design", color: "purple", slug: "design" },
  { name: "Business", color: "green", slug: "business" },
  { name: "Science", color: "indigo", slug: "science" },
  { name: "Health", color: "pink", slug: "health" },
  { name: "Travel", color: "yellow", slug: "travel" },
  { name: "Food", color: "orange", slug: "food" },
  { name: "Lifestyle", color: "teal", slug: "lifestyle" },
  { name: "Politics", color: "red", slug: "politics" },
  { name: "Entertainment", color: "cyan", slug: "entertainment" }
];