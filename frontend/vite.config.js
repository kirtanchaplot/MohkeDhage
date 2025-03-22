import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",  // Ensure the root is the "frontend" folder
  plugins: [react()],
  build: {
    outDir: "dist", // Output folder
    emptyOutDir: true, // Ensure old builds are cleared
  },
  server: {
    proxy: {
      "/api/": "https://mohkedhage.onrender.com",
    },
  },
});




// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       // Remove localhost since backend is on Render
//       "/api/": "https://mohkedhage.onrender.com",
//     },
//   },
// });







//   server: {
//     proxy: {
//       "/api/": "http://localhost:5000",
//       "/uploads/": "http://localhost:5000",
//     },
//   },
// })
