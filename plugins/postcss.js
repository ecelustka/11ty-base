const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const postcssConfig = require('postcss-load-config')

const defaultOptions = {
    srcFiles: ['./_site/css/index.css'],
}

module.exports = (eleventyInstance, options = defaultOptions) => {
    try {
        if (options.srcFiles instanceof Array) {
            options.srcFiles.forEach(async (item) => {
                const postcssDir = fs.existsSync(path.dirname(item))

                //If postCssPath directory doesn't exist...
                if (!postcssDir) {
                    throw new Error('POSTCSS plugin: CSS file does not exists.')
                }

                // Read file
                const file = fs.readFileSync(item, 'utf-8')

                // Load postcss plugins and options
                const { plugins, options } = await postcssConfig()

                // process file
                const processedFile = await postcss(plugins).process(
                    file,
                    options
                )

                // write processed file
                fs.writeFileSync(item, processedFile.css)

                // if maps, write processed maps
                if (processedFile.map) {
                    fs.writeFileSync(`${item}.map`, processedFile.map)
                }
            })
        } else {
            throw new Error("POSTCSS plugin: key srcFiles isn't an Array")
        }
    } catch (error) {
        throw new Error(error)
    }
}
