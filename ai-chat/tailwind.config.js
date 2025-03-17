/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wechat-green': '#07C160',
        'wechat-bg': '#F5F5F5',
      },
    },
  },
  plugins: [],
} 