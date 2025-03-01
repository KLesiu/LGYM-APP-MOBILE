/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgColor:"#0A0A0A",
        primaryColor: "#94E798",
        secondaryColor: "#1E1E1E",
        secondaryColor70: "rgba(30, 30, 30, 0.7)",
        thirdColor: "#121212",
        fourthColor: "rgba(24, 24, 24, 0.25)",
        fifthColor: "#787878",

      },
      screens: {
        smh: { raw: "(min-height: 600px)" },
        xsmh: { raw: "(min-height: 700px)" },
        mdh: { raw: "(min-height: 800px)" },
        lgh: { raw: "(min-height: 900px)" },
      },
    },
  },
  plugins: [],
};
