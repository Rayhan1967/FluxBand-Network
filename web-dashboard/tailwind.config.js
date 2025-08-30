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
        primary: '#00ff88',
        'primary-dark': '#00cc6a',
        secondary: '#1a1a1a',
        dark: '#0a0a0a',
        surface: '#1e1e1e',
        'surface-light': '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        accent: '#00ffff',
      },
      fontFamily: {
        mono: ['var(--font-mono)'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
