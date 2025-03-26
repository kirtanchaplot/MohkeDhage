export const BASE_URL = import.meta.env.VITE_NODE_ENV === 'production' 
  ? "https://mohkedhage.onrender.com"
  : "http://localhost:5000";

export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const RAZORPAY_URL = `${BASE_URL}/api/config/razorpay`;
