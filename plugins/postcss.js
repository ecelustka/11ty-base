const postcss = require('postcss')
const fs = require('fs')
const path = require('path')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const purgecss = require('@fullhuman/postcss-purgecss')

const postCssFce = (path) => {
    fs.readFile(path, (err, css) => {
        postcss([
            autoprefixer,
            cssnano,
            purgecss({
                content: ['./**/*.html', './**/*.css'],
            }),
        ])
            .process(css, { from: path, to: path })
            .then((result) => {
                fs.writeFile(path, result.css, () => true)
                if (result.map) {
                    fs.writeFile(`${path}.map`, result.map, () => true)
                }
            })
    })
}

module.exports = (postCssPath) => {
    //If postCssPath directory doesn't exist...
    if (!fs.existsSync(path.dirname(postCssPath))) {
        console.error('CSS does not exists')
    } else {
        postCssFce(postCssPath)
    }

    //Watch for changes to postCssPath directory...
    if (process.env.NODE_ENV === 'development') {
        fs.watch(path.dirname(postCssPath), () => {
            postCssFce(postCssPath)
        })
    }
}
