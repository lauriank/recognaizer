/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: '#069494',
        brown: '#4C2A20',
        white: '#F1F1F1',
        black: '#101010',
      },
      fontFamily: {
        'clash': ['Clash Display', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

