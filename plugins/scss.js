const fs = require('fs')
const path = require('path')
const sass = require('node-sass-promise')
const fsAsync = fs.promises

module.exports = async (scssPath, cssPath) => {
    const cssDir = fs.existsSync(path.dirname(cssPath))

    //If cssPath directory doesn't exist...
    if (!cssDir) {
        await fsAsync.mkdir(path.dirname(cssPath), {
            recursive: true,
        })
    }

    //Render css from sass
    const file = await sass.render({ file: scssPath })

    // Write result css string to cssPath file
    await fsAsync.writeFile(cssPath, file.css.toString())
}
