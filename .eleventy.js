const { DateTime } = require('luxon')
const config = require('./11ty-base.config');
const czechNbsp = require('./filters/czechNbsp');
const fs = require('fs')
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it')
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const postcss = require('./plugins/postcss')
const pwa = require('eleventy-plugin-pwa')
const scss = require('./plugins/scss')
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');

module.exports = function (eleventyConfig) {
    if (config.plugins.rss.use) {
        eleventyConfig.addPlugin(pluginRss)
    }

    if (config.plugins.navigation.use) {
        eleventyConfig.addPlugin(pluginNavigation)
    }

    if (config.plugins.pwa.use) {
        eleventyConfig.addPlugin(pwa, config.plugins.pwa.options)
    }

    if (config.filters.czechNbsp.use) {
        eleventyConfig.addNunjucksFilter('czechNbsp', czechNbsp)
    }

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    if (config.filters.htmlDateString.use) {
        eleventyConfig.addFilter('htmlDateString', (dateObj) => {
            return DateTime.fromJSDate(dateObj, { zone: config.filters.htmlDateString.options.zone }).toFormat(config.filters.htmlDateString.options.format)
        })
    }

    if (config.filters.readableDate.use) {
        eleventyConfig.addFilter('readableDate', (dateObj) => {
            return DateTime.fromJSDate(dateObj, { zone: config.filters.readableDate.options.zone }).toFormat(config.filters.readableDate.options.format)
        })
    }

    if (config.filters.markdown.use) {
        eleventyConfig.addFilter('md', (value) => {
            return nunjucksMarkdownFilter(value)
        })
    }

    if (config.features.sass.use) {
        eleventyConfig.addPlugin(scss, config.features.sass.options)
    }

    if (config.features.postcss.use) {
        eleventyConfig.addPlugin(postcss, config.features.postcss.options)
    }

    if (config.features.imgFolder.use) {
        eleventyConfig.addPassthroughCopy('img')
    }

    if (config.features.staticFolder.use) {
        eleventyConfig.addPassthroughCopy({
            './static': '.',
        })
    }

    if (process.env.ELEVENTY_ENV === 'production') {
        eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
            if (outputPath.endsWith('.html')) {
                const minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true
                });
                return minified;
            }
            return content;
        });

        eleventyConfig.addPlugin(cacheBuster({
            outputDirectory: config.eleventy.output
        }));
    }

    /* Markdown Overrides */
    let markdownLibrary = markdownIt(config.features.markdownIt.options)
    eleventyConfig.setLibrary('md', markdownLibrary)

    eleventyConfig.setDataDeepMerge(true)

    // Browsersync Overrides
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: (err, browserSync) => {
                browserSync.publicInstance.watch('./src/**/*.scss', async () => {

                    if (config.features.sass.use) {
                        await scss(eleventyConfig, config.features.sass.options)
                    }

                    browserSync.publicInstance.reload()
                })

                browserSync.publicInstance.watch('./src/**/*.scss', async () => {
                    if (config.features.postcss.use) {
                        await postcss(eleventyConfig, config.features.postcss.options)
                    }

                    browserSync.publicInstance.reload()
                })

                const content_404 = fs.readFileSync(`${config.eleventy.output}/404.html`)

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

    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

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
            ...config.eleventy,
        },
    }
}
