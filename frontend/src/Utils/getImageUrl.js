// const getImageUrl = (path) => {
//     // Define your backend base URL
//     const BASE_URL = import.meta.env.VITE_API_URL || "https://mohkedhage.onrender.com";
  
//     // If the path is already an absolute URL, return it directly
//     if (path.startsWith("http")) {
//       return path;
//     }
  
//     // Otherwise, prepend the BASE_URL to form the full URL
//     return `${BASE_URL}${path}`;
//   };
  
//   export default getImageUrl;
  
// src/Utils/getImageUrl.js
export default function getImageUrl(imagePath) {
    if (!imagePath) return '/placeholder.png';
    
    // Clean up the path - remove any leading slashes or existing 'uploads' prefixes
    const cleanPath = imagePath.replace(/^\/|^uploads\/|^\/uploads\//, '');
    
    // Return the properly formatted path
    return `/uploads/${cleanPath}`;
  }