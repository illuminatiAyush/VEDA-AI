/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          light: 'var(--brand-light)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        frame: 'var(--frame)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          hover: 'var(--danger-hover)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
      },
      borderRadius: {
        'veda': '16px',
        'veda-lg': '20px',
        'veda-xl': '24px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.06)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
        'brand-glow': '0 0 0 1px var(--brand-glow)',
      },
    },
  },
  plugins: [],
}
