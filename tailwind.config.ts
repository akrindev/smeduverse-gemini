// import konstaConfig config
const konstaConfig = require("konsta/config");

// wrap config with konstaConfig config
module.exports = konstaConfig({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
