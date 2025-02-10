// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'), // Correct way to add tailwindcss
    require('autoprefixer'), // Correct way to add autoprefixer
  ],
};