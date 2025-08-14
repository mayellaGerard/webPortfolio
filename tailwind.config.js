/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    container: {
      center :true,
      padding:'16px',

    },
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#64748B',
        dark: '#18181B'
      },
      screens: {
        '2xl': '1320px',
      }
    },
  },
  plugins: [],
}

