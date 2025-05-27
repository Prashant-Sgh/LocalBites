// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F03328',
        accent: '#FF9E0C',
        background: '#F5F5F5',
        gray: {
          900: '#000000',
          800: '#1F1F1F',
          700: '#3D3D3D',
          600: '#5C5C5C',
          500: '#7A7A7A',
          400: '#999999',
          300: '#B8B8B8',
          200: '#D6D6D6',
          100: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)'],
        nunito: ['var(--font-nunito)'],
      }
    },
  },
  plugins: [],
}
