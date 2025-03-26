// src/utils/imageUrl.js

const getImageUrl = (imagePath) => {
    // Get the API URL - always use the backend URL in production
    const apiUrl = 'https://mohkedhage.onrender.com';
    
    // Handle missing image path
    if (!imagePath) {
        return `${apiUrl}/placeholder-image.jpg`;
    }
    
    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Clean the image path and remove any double slashes
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/\/+/g, '/');
    
    // Remove 'uploads' from the path if it exists since we'll add it back
    const pathWithoutUploads = cleanPath.replace(/^uploads\/|^\/uploads\//, '');
    
    // Construct the final URL
    const finalPath = `/uploads/${pathWithoutUploads}`;
    
    // Ensure there are no double slashes in the final URL
    const finalUrl = `${apiUrl}${finalPath}`.replace(/([^:]\/)\/+/g, '$1');
    
    console.log('Image URL:', finalUrl); // Debug log
    
    return finalUrl;
};
  
export default getImageUrl;


  //new1111111all