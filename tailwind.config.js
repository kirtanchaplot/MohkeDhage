/** @type {import('tailwindcss').Config} */
export default {
    // content: ["./index.html", 
    //         "./src/**/*.{js,ts,jsx,tsx}"],
    content: [
        "./frontend/index.html",  // Update to reflect the correct path
        "./frontend/src/**/*.{js,ts,jsx,tsx}", // Adjusted for 'src' inside 'frontend'
      ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  

// module.exports = {
//     content: [
//       "./index.html",
//       "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   };
  