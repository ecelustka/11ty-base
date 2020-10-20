const { DateTime } = require('luxon')
const fs = require('fs')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const scss = require('./plugins/scss')
const postcss = require('./plugins/postcss')
const pwa = require('eleventy-plugin-pwa')
const czechNbsp = require('./filters/czechNbsp');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(scss, {
        srcFiles: ['./src/scss/index.scss'],
        outputDir: './_site/css',
        sourcemaps: false,
    })
    eleventyConfig.addWatchTarget('./src/scss/')

    eleventyConfig.addPlugin(postcss, {
        srcFiles: ['./_site/css/index.css']
    })
    eleventyConfig.addWatchTarget('./_site/css/')

    eleventyConfig.addPlugin(pluginRss)
    eleventyConfig.addPlugin(pluginSyntaxHighlight)
    eleventyConfig.addPlugin(pluginNavigation)

    // ENABLE PWA
    // eleventyConfig.addPlugin(pwa, {
    //     swDest: './_site/sw.js',
    //     globDirectory: './_site',
    //     globPatterns: ['**/*.{png,ico,json,woff,woff2,jpg,jpeg,webp,html,js,css}'],
    // })

    eleventyConfig.setDataDeepMerge(true)

    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

    eleventyConfig.addFilter('readableDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
            'dd LLL yyyy'
        )
    })

    eleventyConfig.addNunjucksFilter('czechNbsp', czechNbsp);

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
            'yyyy-LL-dd'
        )
    })

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter('head', (array, n) => {
        if (n < 0) {
            return array.slice(n)
        }

        return array.slice(0, n)
    })

    eleventyConfig.addCollection('tagList', function (collection) {
        let tagSet = new Set()
        collection.getAll().forEach(function (item) {
            if ('tags' in item.data) {
                let tags = item.data.tags

                tags = tags.filter(function (item) {
                    switch (item) {
                        // this list should match the `filter` list in tags.njk
                        case 'all':
                        case 'nav':
                        case 'post':
                        case 'posts':
                            return false
                    }

                    return true
                })

                for (const tag of tags) {
                    tagSet.add(tag)
                }
            }
        })

        // returning an array in addCollection works in Eleventy 0.5.3
        return [...tagSet]
    })

    eleventyConfig.addPassthroughCopy('img')
    eleventyConfig.addPassthroughCopy({
        './static': '.',
    })

    /* Markdown Overrides */
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
    })

    eleventyConfig.setLibrary('md', markdownLibrary)

    // Browsersync Overrides
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: (err, browserSync) => {
                browserSync.publicInstance.watch('./src/**/*.scss', async () => {
                    await scss(eleventyConfig, {
                        srcFiles: ['./src/scss/index.scss'],
                        outputDir: './_site/css',
                        sourcemaps: false,
                    })

                    browserSync.publicInstance.stream()
                })

                browserSync.publicInstance.watch('./src/**/*.scss', async () => {
                    await postcss(eleventyConfig, {
                        srcFiles: ['./_site/css/index.css']
                    })

                    browserSync.publicInstance.stream()
                })

                const content_404 = fs.readFileSync('_site/404.html')

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404)
                    res.end()
                })
            },
        },
        ui: false,
        ghostMode: false,
    })

    return {
        templateFormats: ['md', 'njk', 'html', 'liquid'],

        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about those.

        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for link URLs (it does not affect your file structure)
        // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

        // You can also pass this in on the command line using `--pathprefix`
        // pathPrefix: "/",

        markdownTemplateEngine: 'liquid',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',

        // These are all optional, defaults are shown:
        dir: {
            input: '.',
            includes: 'src/_includes',
            data: 'src/_data',
            output: '_site',
        },
    }
}
