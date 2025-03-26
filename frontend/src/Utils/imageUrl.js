// src/utils/imageUrl.js

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Get the API URL from environment variables
    const apiUrl = import.meta.env.VITE_API_URL || 'https://mohkedhage.onrender.com';
    
    // Clean the image path
    const cleanPath = imagePath.replace(/\\/g, '/');
    
    // Handle both /uploads/image.jpg and uploads/image.jpg formats
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    // Ensure we're using the correct path for uploads
    const uploadPath = formattedPath.includes('uploads/') ? formattedPath : `/uploads${formattedPath}`;
    
    return `${apiUrl}${uploadPath}`;
};
  
export default getImageUrl;


  //new1111111all