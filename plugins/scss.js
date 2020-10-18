const fs = require('fs')
const path = require('path')
const sass = require('sass')
const fsAsync = fs.promises

const defaultOptions = {
    srcFiles: ['./src/scss/index.scss'],
    outputDir: './_site/css',
    sourcemaps: false,
}

module.exports = async (eleventyInstance, options) => {
    try {
        const cssDir = fs.existsSync(
            options.outputDir || defaultOptions.outputDir
        )

        //If cssPath directory doesn't exist...
        if (!cssDir) {
            await fsAsync.mkdir(options.outputDir || defaultOptions.outputDir, {
                recursive: true,
            })
        }

        // Check if variable is an Array
        if (options.srcFiles instanceof Array) {
            // Render each file
            options.srcFiles.forEach(async (item) => {
                // prettier-ignore
                const ouputFileName = `${options.outputDir || defaultOptions.outputDir}/${path.parse(item).name}.css`

                //Render css from sass
                const file = sass.renderSync({
                    file: item,
                    sourceMap: options.sourcemaps,
                    outFile: ouputFileName,
                })

                // Write result css string to cssPath file
                fs.writeFileSync(ouputFileName, file.css, 'utf-8')

                // Write result maps
                if (file.map) {
                    fs.writeFileSync(`${ouputFileName}.map`, file.map, 'utf-8')
                }
            })
        } else {
            throw new Error("SCSS plugin: key srcFiles isn't an Array")
        }
    } catch (error) {
        throw new Error(error)
    }
}
