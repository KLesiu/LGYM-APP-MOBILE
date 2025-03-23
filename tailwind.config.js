/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgColor:"#0A0A0A",
        primaryColor: "#20BC2D",
        secondaryColor: "#1E1E1E",
        secondaryColor70: "rgba(30, 30, 30, 0.7)",
        secondaryColor90 : "rgba(30, 30, 30, 0.9)",
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
