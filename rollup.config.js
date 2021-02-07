import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { config } from 'dotenv'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ELEVENTY_ENV !== 'production'

const envVariables = config().parsed

export default {
    input: 'src/js/index.js',
    output: {
        sourcemap: false,
        format: 'iife',
        file: '_site/js/index.bundle.js',
    },
    plugins: [
        resolve({ browser: true }),
        replace({
            process: JSON.stringify({
                env: {
                    ...envVariables,
                },
            }),
        }),
        commonjs(),
        babel(),
        !dev && terser(),
    ],
    watch: {
        clearScreen: false,
    },
}
