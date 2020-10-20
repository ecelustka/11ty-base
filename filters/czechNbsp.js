module.exports = (value) => {
    // start of a paragrafs regex
    value = value.replace(
        /(>|\(|\[|\{)?(A|I|O|U|K|S|V|Z)(<\/[a-z0-9]>)? /g,
        // new RegExp('(>|\\(|\\[|\\{)?(A|I|O|U|K|S|V|Z)(</[a-z0-9]>)? ', 'g'),
        // prettier-ignore
        '\$1\$2\$3\&#160;'
    )

    // in the middle of text
    value = value.replace(
        / (\(|\[|\{)?(A|I|O|U|K|S|V|Z|a|i|o|u|k|s|v|z)(<\/[a-z0-9]>)? /g,
        // prettier-ignore
        ' \$1\$2\$3\&#160;'
    )

    // number regex
    value = value.replace(
        /( |>|\(|\[|\{|[0-9]*)(\d\.?)(<\/[a-z0-9]>)? /g,
        // prettier-ignore
        '\$1\$2\$3\&#160;'
    )

    // inicials regex
    value = value.replace(
        /( |>|\(|\[|\{)([A-Z]\.)(<\/[a-z0-9]>)? /g,
        // prettier-ignore
        '\$1\$2\$3\&#160;'
    )

    return value
}
