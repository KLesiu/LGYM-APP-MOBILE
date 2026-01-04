/** @type {import('tailwindcss').Config} */
const myColors = require("./constants/colors");
module.exports = {
  content: ["./app/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:myColors,
      screens: {
        smh: { raw: "(min-height: 600px)" },
        xsmh: { raw: "(min-height: 700px)" },
        mdh: { raw: "(min-height: 800px)" },
        lgh: { raw: "(min-height: 900px)" },
        smallPhone: { raw: "(max-width: 360px) and (max-height: 1280px)" }, // Galaxy J3
        budgetPhone: {
          raw: "(max-width: 400px) and (min-height: 1281px) and (max-height: 1600px)",
        }, // A12, Redmi
        midPhone: {
          raw: "(max-width: 430px) and (min-height: 1601px) and (max-height: 2340px)",
        }, // Pixel 5, iPhone 11
        largePhone: {
          raw: "(max-width: 450px) and (min-height: 2341px) and (max-height: 2532px)",
        }, // iPhone 13/14/15
        maxPhone: {
          raw: "(max-width: 480px) and (min-height: 2533px) and (max-height: 2778px)",
        }, // iPhone 14 Pro Max
        ultraPhone: { raw: "(min-width: 480px) and (min-height: 2779px)" }, // Galaxy S21 Ultra itp.
      },
    },
  },
  plugins: [],
};
