/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightPurple: "#645cff",
        whiteLine: "#a2a2a3",
        pageBackground: "#E2dee9",
        whiteBackground: "#f7f6fa",
        mainText: "#102a42",
        deleteRed: "#991b1b",
        editGreen: "#15803d",
        navHover: "#5c5cff",
      },
    },
  },
  plugins: [],
};
