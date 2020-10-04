const sass = require('node-sass-promise')
const fs = require('fs-extra')
const path = require('path')

module.exports = (scssPath, cssPath) => {
    //If cssPath directory doesn't exist...
    if (!fs.existsSync(path.dirname(cssPath))) {
        //Create cssPath directory recursively
        fs.mkdir(path.dirname(cssPath), { recursive: true })
            //Render css from sass
            .then(() => sass.render({ file: scssPath }))
            //Then write result css string to cssPath file
            .then((result) => fs.writeFile(cssPath, result.css.toString()))
            .catch((error) => console.error(error))
    }
    //Watch for changes to scssPath directory...
    fs.watch(path.dirname(scssPath), () => {
        //Render css from sass...
        sass.render({ file: scssPath })
            //Then write result css string to cssPath file
            .then((result) => fs.writeFile(cssPath, result.css.toString()))
            .catch((error) => console.error(error))
        console.log(`Watching ${path.dirname(scssPath)}...`)
    })
}
