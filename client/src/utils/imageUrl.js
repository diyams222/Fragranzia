/**
 * Helper to safely resolve product image URLs (Cloudinary, absolute URLs, or local uploads)
 */
export const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `http://localhost:5000${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `http://localhost:5000/${image}`;
  }

  return `http://localhost:5000/uploads/${image}`;
};
