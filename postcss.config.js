const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    from: undefined,
    map: false,
    plugins: [
        require('autoprefixer'),
        ...(process.env.ELEVENTY_ENV === 'production'
            ? [
                  require('cssnano'),
                  purgecss({
                      content: ['./**/*.html'],
                  }),
            ]
            : []),
    ],
}
