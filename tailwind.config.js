/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/views/*.hbs",
    "src/views/layouts/*.hbs",
    "src/views/partials/*.hbs",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'mobile': '700px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Dark mode
        "vampire-black": "#0a0a0a", // background color
        "eerie-black": "#181818", // container color
        "chinese-black": "#171717", // hover color
        "charleston-green": "#2d2d2d", // border color
        "davy-grey": "#565656", // icon color
        "cultured-active": "#f4f5f7", // icon active color
        "cultured": "#f3f5f7", // text color
        "sonic-silver": "#777777", // placeholder color

        // Light mode
        "lotion": "#fafafa", // background color
        "white": "#ffffff", // container color
        "anti-flash-white": "#f0f0f0", // hover color
        "light-gray": "#d5d5d5", // border color
        "philippine-silver": "#b1b1b1", // icon color
        "black": "#000000", // text color + icon active color
        "spanish-gray": "#999999", // placeholder color

        "red-salsa": "#ff3040" // Logout button color
      },
    },
  },
  darkMode: 'class', 
  plugins: [],
}

