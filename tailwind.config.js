/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        red: "#E90808",
        yellow: "#f1b234",
      },
    },
  },
  plugins: [],
};
