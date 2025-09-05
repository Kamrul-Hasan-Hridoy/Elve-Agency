// utils/imageLoader.js
/*export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}; */



export const getImageUrl = (path) => {
  if (!path) return "";
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For local images, use the backend server URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  
  // Handle URL encoding for special characters
  try {
    const url = new URL(path, baseUrl);
    return url.href;
  } catch (e) {
    console.error("Error creating image URL:", e);
    return `${baseUrl}${path}`;
  }
};