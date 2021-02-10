module.exports = {
    eleventy: {
        // DOCS: https://www.11ty.dev/docs/config/
        input: '.',
        includes: 'src',
        data: 'data',
        output: '_site',
    },
    filters: {
        markdown: {
            // INFO: https://www.npmjs.com/package/nunjucks-markdown-filter
            use: true,
        },
        czechNbsp: {
            use: false,
        },
        htmlDateString: {
            //INFO: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
            use: true,
            options: {
                zone: 'utc',
                format: 'yyyy-LL-dd',
            },
        },
        readableDate: {
            use: true,
            options: {
                zone: 'utc',
                format: 'dd LLL yyyy',
            },
        },
    },
    features: {
        markdownIt: {
            options: {
                html: true,
                breaks: true,
                linkify: true,
            },
        },
        sass: {
            use: true,
            options: {
                srcFiles: ['./src/scss/index.scss'],
                outputDir: './_site/css',
                sourcemaps: false,
            },
        },
        postcss: {
            use: true,
            options: {
                srcFiles: ['./_site/css/index.css'],
            },
        },
        imgFolder: {
            use: true,
        },
        staticFolder: {
            use: true,
        },
    },
    plugins: {
        rss: {
            // DOCS: https://github.com/11ty/eleventy-plugin-rss
            use: true,
        },
        pwa: {
            // DOCS: https://github.com/okitavera/eleventy-plugin-pwa#readme
            use: false,
            options: {
                swDest: './_site/sw.js',
                globDirectory: './_site',
            },
        },
        navigation: {
            // DOCS: https://www.11ty.dev/docs/plugins/navigation/
            use: true,
        },
    },
}
