/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 1s infinite', // Animation that repeats infinitely
        bounce: 'bounce 1s infinite', // You can use bounce or any other animation you prefer
      },
      keyframes: {
        pulse: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
  },
},
  plugins: [],
}

