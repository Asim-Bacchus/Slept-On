/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        keyframes: {
          'rise': {
            '0%': { transform: 'scaleY(0)' },
            '100%': { transform: 'scaleY(1)' }
          }
        },
        animation: {
          'rise-0': 'rise 1.2s ease-out forwards',
          'rise-40': 'rise 1.2s ease-out forwards',
          'rise-60': 'rise 1.4s ease-out forwards',
          'rise-70': 'rise 1.5s ease-out forwards',
          'rise-75': 'rise 1.6s ease-out forwards',
          'rise-85': 'rise 1.7s ease-out forwards',
          'rise-90': 'rise 1.8s ease-out forwards',
        }
      },
    },
    plugins: [require("tailwindcss-animate")],
  }