const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    from: undefined,
    map: false,
    plugins: [
        require('autoprefixer'),
        require('cssnano'),
        purgecss({
            content: ['./**/*.html'],
        }),
    ],
}
