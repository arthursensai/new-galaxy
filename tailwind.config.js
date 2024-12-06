module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'main-color': 'linear-gradient(135deg, #4e54c8, #8f94fb)',
      },
      fontFamily: {
        custom: ['raleway', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'fade-in-delayed': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-delayed': 'fade-in-delayed 0.5s ease-out 0.5s forwards'
      }
    },
  },
  plugins: [],
};