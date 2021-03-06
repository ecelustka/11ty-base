const fs = require('fs')
const path = require('path')
const sass = require('sass')

const defaultOptions = {
    srcFiles: ['./src/scss/index.scss'],
    outputDir: './_site/css',
    sourcemaps: false,
}

module.exports = (eleventyInstance, options = defaultOptions) => {
    try {
        const cssDir = fs.existsSync(options.outputDir)

        //If cssPath directory doesn't exist...
        if (!cssDir) {
            fs.mkdirSync(options.outputDir, {
                recursive: true,
            })
        }

        // Check if variable is an Array
        if (!Array.isArray(options.srcFiles)) {
            throw "SCSS plugin: key srcFiles isn't an Array"
        }

        // Render each file
        options.srcFiles.forEach((item) => {
            // prettier-ignore
            const ouputFileName = `${options.outputDir}/${path.parse(item).name}.css`

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
    } catch (error) {
        throw new Error(error)
    }
}
