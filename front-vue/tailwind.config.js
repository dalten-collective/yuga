const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['index.html','./src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    // fontSize: {
    //   sm: '0.8rem',
    //   base: '2rem',
    //   lg: '1.25rem',
    //   xl: '1.25rem',
    //   '2xl': '1.563rem',
    //   '3xl': '1.953rem',
    //   '4xl': '2.441rem',
    //   '5xl': '3.052rem',
    // },
    extend: {},
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'html': {
          fontSize: "19px",
        }
      })
    }),
  ],
}
