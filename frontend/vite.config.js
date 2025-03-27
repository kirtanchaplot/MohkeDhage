import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://mohkedhage.onrender.com'),
      'import.meta.env.VITE_RAZORPAY_KEY_ID': JSON.stringify(env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key')
    },
    server: {
      proxy: {
        "/api/": {
          target: env.VITE_API_URL || "https://mohkedhage.onrender.com",
          changeOrigin: true,
          secure: false
        },
        "/uploads/": {
          target: env.VITE_API_URL || "https://mohkedhage.onrender.com",
          changeOrigin: true,
          secure: false
        }
      },
    },
  };
});



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   root: ".",
//   plugins: [react()],
//   build: {
//     outDir: "dist",
//     emptyOutDir: true,
//   },
//   server: {
//     proxy: {
//       "/api/": "https://mohkedhage.onrender.com",
//       "/uploads/": "https://mohkedhage.onrender.com" // Add this line to proxy image requests
//     },
//   },
// });

