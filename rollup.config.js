import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.NODE_ENV !== 'production'

export default {
    input: 'src/js/index.js',
    output: {
        sourcemap: false,
        format: 'iife',
        name: 'main',
        file: '_site/js/index.bundle.js',
    },
    plugins: [babel(), commonjs(), resolve(), !dev && terser()],
    watch: {
        clearScreen: false,
    },
}
