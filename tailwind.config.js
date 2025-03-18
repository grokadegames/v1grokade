/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'grok-purple': '#9966FF',
        'grok-dark': '#121212',
        'grok-darker': '#0A0A0A',
        'grok-card': '#1E1E1E',
        'grok-border': '#333333',
        'grok-red': '#FF4D4D',
        'grok-text': '#FFFFFF',
        'grok-text-secondary': '#A0A0A0',
        'grok-featured': '#9966FF',
        'grok-live': '#00FF66',
        'grok-button': {
          primary: '#9966FF',
          secondary: '#333333',
          outline: '#333333',
        },
        'grok-purple-dark': '#7823C7',
        'grok-button-primary': '#8A2BE2',
        'grok-button-secondary': '#2E2E2E'
      },
      fontFamily: {
        'sans': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Hide scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',
          /* Firefox */
          'scrollbar-width': 'auto',
          /* Show scrollbar for Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'block',
          },
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
}

