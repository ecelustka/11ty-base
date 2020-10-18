const fs = require('fs')
const path = require('path')
const fsAsync = fs.promises
const postcss = require('postcss')
const postcssConfig = require('postcss-load-config')

const defaultOptions = {
    srcFiles: ['./_site/css/index.css'],
}

module.exports = async (eleventyInstance, options) => {
    try {
        if (options.srcFiles instanceof Array) {
            setTimeout(() => {
                options.srcFiles.forEach(async (item) => {
                    const postcssDir = fs.existsSync(path.dirname(item))

                    //If postCssPath directory doesn't exist...
                    if (!postcssDir) {
                        throw new Error(
                            'POSTCSS plugin: CSS file does not exists.'
                        )
                    }

                    // Read file
                    const file = await fsAsync.readFile(item, 'utf-8')

                    // Load postcss plugins and options
                    const { plugins, options } = await postcssConfig()

                    // process file
                    const processedFile = await postcss(plugins).process(
                        file,
                        options
                    )

                    // write processed file
                    await fsAsync.writeFile(item, processedFile.css)

                    // if maps, write processed maps
                    if (processedFile.map) {
                        await fsAsync.writeFile(
                            `${item}.map`,
                            processedFile.map
                        )
                    }
                })
            }, 300)
        } else {
            throw new Error("POSTCSS plugin: key srcFiles isn't an Array")
        }
    } catch (error) {
        throw new Error(error)
    }
}
