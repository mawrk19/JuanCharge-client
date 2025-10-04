module.exports = (ctx) => ({
  plugins: [
    ctx.env === 'production' 
      ? require('@tailwindcss/postcss')
      : require('@tailwindcss/postcss'),
    require('autoprefixer')
  ]
})