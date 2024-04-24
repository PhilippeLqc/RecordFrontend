/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        dropHomePage: 'drop 2s ease-in-out',
        riseHomePage: 'rise 2s ease-in-out',
        slideInRightHomePage: 'slideInRight 2s ease-in-out',

        drop: 'drop 0.5s ease-in-out',
        slideInRight: 'slideInRight 0.5s ease-in-out',
        slideInLeft: 'slideInLeft 0.5s ease-in-out',
      },
      keyframes: {
        drop: {
          '0%': { opacity: '0', transform: 'translateY(-50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' }, // Changed from translateX(50px)
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      }
    }
  },
  variants: {},
  plugins: [],
};
