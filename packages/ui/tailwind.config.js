/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './src/**/*.css'],
  safelist: [
    // 强制包含所有主题颜色类
    {
      pattern:
        /^(text|bg|border)-(base|primary|secondary|accent|neutral|info|success|warning|error)(-\d+)?$/,
      variants: ['hover', 'focus', 'active', 'disabled'],
    },
    {
      pattern:
        /^(text|bg|border)-(base|primary|secondary|accent|neutral|info|success|warning|error)-content$/,
      variants: ['hover', 'focus', 'active', 'disabled'],
    },
  ],
  theme: {
    extend: {
      colors: {
        base: {
          100: 'var(--color-base-100)',
          200: 'var(--color-base-200)',
          300: 'var(--color-base-300)',
          content: 'var(--color-base-content)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          content: 'var(--color-primary-content)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          content: 'var(--color-secondary-content)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          content: 'var(--color-accent-content)',
        },
        neutral: {
          DEFAULT: 'var(--color-neutral)',
          content: 'var(--color-neutral-content)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          content: 'var(--color-info-content)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          content: 'var(--color-success-content)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          content: 'var(--color-warning-content)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          content: 'var(--color-error-content)',
        },
      },
    },
  },
}
