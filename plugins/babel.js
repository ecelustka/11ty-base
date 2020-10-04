const babel = require('@babel/core')
const fs = require('fs')
const path = require('path')

module.exports = (filePath, outputFile) => {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true })
    babel
        .transformFileAsync(filePath, {
            presets: ['@babel/preset-env'],
        })
        .then((result) => {
            fs.writeFile(outputFile, result.code, () => true)
        })

    if (process.env.NODE_ENV === 'development') {
        fs.watch(path.dirname(filePath), () => {
            //Render css from sass...
            babel
                .transformFileAsync(filePath, {
                    presets: ['@babel/preset-env'],
                })
                .then((result) => {
                    console.log(result)
                    fs.writeFile(outputFile, result.code, () => true)
                })
        })
    }
}
