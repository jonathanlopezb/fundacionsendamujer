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
        senda: {
          pink: '#E12880',
          'pink-dark': '#C21B6B',
          'pink-light': '#FDF2F7',
          purple: '#52166F',
          'purple-dark': '#3B0852',
          'purple-light': '#F4EBF7',
          gold: '#F7A623',
          'gold-dark': '#D9890F',
          teal: '#10B981',
          bg: '#FDF8FA',
          darkBg: '#1A0923',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(82, 22, 111, 0.12)',
        'glass-pink': '0 8px 32px 0 rgba(225, 40, 128, 0.2)',
        glow: '0 0 25px rgba(225, 40, 128, 0.4)',
      },
    },
  },
  plugins: [],
};
