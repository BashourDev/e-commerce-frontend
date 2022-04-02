const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      primary: "#f3dac2",
      primaryDark: "#73675C",
      dark: "#2F343B",
      lightDark: "#434A54",
      lightGray: "#AAB2BD",
      light: "#F5F7FA",
      danger: "#E9573F",
      success: "#28C71A",
      warning: "#E4E904",
      info: "#0057b7",
    },
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
