/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand colors matching the app
        terrain: {
          50: '#f8f7f4',
          100: '#efe9de',
          200: '#e0d5c3',
          300: '#cdb99f',
          400: '#b89a7a',
          500: '#a98262',
          600: '#9c7156',
          700: '#825c49',
          800: '#6b4d40',
          900: '#584136',
          950: '#2f211b',
        },
        forest: {
          50: '#f4f9f4',
          100: '#e5f3e7',
          200: '#cce6d0',
          300: '#a3d1ac',
          400: '#72b580',
          500: '#4f985e',
          600: '#3c7b49',
          700: '#32623c',
          800: '#2b4f33',
          900: '#25412c',
          950: '#102316',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
