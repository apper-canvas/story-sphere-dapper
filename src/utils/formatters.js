import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  }
  
  if (isYesterday(dateObj)) {
    return "Yesterday";
  }
  
  return format(dateObj, "MMM d, yyyy");
};

export const formatRelativeDate = (date) => {
  if (!date) return "";
  
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatReadTime = (minutes) => {
  const numMinutes = Number(minutes);
  if (isNaN(numMinutes) || numMinutes < 1) return "< 1 min read";
  return `${Math.round(numMinutes)} min read`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  
  const numValue = Number(num);
  
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + "M";
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + "K";
  }
  return numValue.toString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string' || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength).trim() + "...";
};

export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return "";
  
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const calculateReadTime = (content) => {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};