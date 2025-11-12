/**
 * Get the correct image URL - handles both Cloudinary URLs and local paths
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/default-avatar.png";
  
  // If it's already a full URL (Cloudinary), use it directly
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Otherwise, use local assets path (for backward compatibility)
  return `http://localhost:3001/assets/${imagePath}`;
};
