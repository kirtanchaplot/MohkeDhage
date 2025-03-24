import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api/": "https://mohkedhage.onrender.com",
      "/uploads/": "https://mohkedhage.onrender.com" // Add this line to proxy image requests
    },
  },
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
//       "/api/": {
//         target: "https://mohkedhage.onrender.com",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/uploads/": {
//         target: "https://mohkedhage.onrender.com",
//         changeOrigin: true,
//         secure: false,
//       }
//     },
//   },
// });