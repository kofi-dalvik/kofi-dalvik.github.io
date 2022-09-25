/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["index.html"],
  theme: {
    extend: {},
    colors: ({ colors }) => ({
      ...colors,
      primary: '#28706C',
      secondary: '#F26440',
      default: '#F2F4F5'
    }),
  },
  plugins: [],
}
