/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#F9FCFB',
      black: '#000000',
      blue: {
        dark: '#3F5370',
        DEFAULT: '#1C5E8E',
        medium: '#5A79A8',
        light: '#7195CA',
        lighter: '#7EA5E0'
      },
      green: {
        light: '#27AE60',
        DEFAULT: '#1C8E4A',
      },
      gray: {
        DEFAULT: '#959797',
        light: '#D9D9D9'
      },
      red: {
        medium: '#F44336'
      },
      yellow: {
        DEFAULT: '#E1C048'
      }
    },
    extend: { 
      keyframes: {
        'loadingBar': {
          'from': { 'background-position': '200%' },
          'to': { 'background-position': '0%' }
        }
      },
      animation: {
        'loadingBar': 'loadingBar 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

