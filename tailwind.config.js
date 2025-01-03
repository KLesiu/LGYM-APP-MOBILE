/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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
