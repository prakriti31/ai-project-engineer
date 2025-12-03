module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#111111',
          800: '#1f1f1f',
          700: '#2c2c2c',
          500: '#4b4b4b',
          300: '#737373',
          100: '#d4d4d4'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
