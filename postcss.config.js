module.exports = {
    from: undefined,
    map: false,
    plugins: [
        require('autoprefixer'),
        ...(process.env.ELEVENTY_ENV === 'production'
            ? [require('postcss-clean')]
            : []),
    ],
}
