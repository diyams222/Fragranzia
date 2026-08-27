const API_URL = "https://fragranzia-8wte.onrender.com";

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
    return `${API_URL}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${API_URL}/${image}`;
  }

  return `${API_URL}/uploads/${image}`;
};