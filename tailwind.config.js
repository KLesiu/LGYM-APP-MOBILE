/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens:{
        'smh':{'raw': '(min-height: 600px)'},
        'mdh':{'raw': '(min-height: 800px)'},
        'lgh':{'raw': '(min-height: 900px)'}
      }
    },
  },
  plugins: [],
}

