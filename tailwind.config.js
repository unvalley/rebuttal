module.exports = {
  important: true,
  // Active dark mode on class basis
  darkMode: 'class',
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  theme: {
    extend: {
      backgroundImage: theme => ({
        check: 'url(\'/icons/check.svg\')',
        landscape: 'url(\'/images/landscape/2.jpg\')',
      }),
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      inset: ['checked'],
      zIndex: ['hover', 'active'],
    },
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light'],
  },
}
