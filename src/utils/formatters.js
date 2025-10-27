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
  if (minutes < 1) return "< 1 min read";
  return `${Math.round(minutes)} min read`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};