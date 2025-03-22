import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Remove localhost since backend is on Render
      "/api/": "https://mohkedhage.onrender.com",
    },
  },
});







//   server: {
//     proxy: {
//       "/api/": "http://localhost:5000",
//       "/uploads/": "http://localhost:5000",
//     },
//   },
// })
