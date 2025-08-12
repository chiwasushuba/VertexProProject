module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",     // for App Router
    "./pages/**/*.{js,ts,jsx,tsx}",   // for Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // shared components
  ],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
