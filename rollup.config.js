import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ELEVENTY_ENV !== 'production'

// prettier-ignore
export default {
    input: 'src/js/index.js',
    output: {
        sourcemap: false,
        format: 'iife',
        file: '_site/js/index.bundle.js'
    },
    plugins: [
        resolve({ browser: true }),
        commonjs(),
        babel(),
        !dev && terser(),
    ],
    watch: {
        clearScreen: false,
    },
}
