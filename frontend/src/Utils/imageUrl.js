// src/utils/imageUrl.js

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Handle both /uploads/image.jpg and uploads/image.jpg formats
    const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${apiUrl}${formattedPath}`;
  };
  
  export default getImageUrl;


  //new1111111all