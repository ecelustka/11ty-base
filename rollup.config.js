import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import outputManifest from 'rollup-plugin-output-manifest'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ELEVENTY_ENV !== 'production'

// prettier-ignore
export default {
    input: 'src/js/index.js',
    output: {
        sourcemap: false,
        format: 'iife',
        dir: '_site/js',
        name: 'index',
        entryFileNames: dev ? 'index.bundle.js' : '[name].[hash].js',
        chunkFileNames: dev ? 'index.bundle.js' : '[name].[hash].js',
    },
    plugins: [
        resolve({ browser: true }),
        commonjs(),
        babel(),
        !dev && terser(),
        !dev && outputManifest({
            fileName: '../../data/manifest.json',
            publicPath: '/js/',
            isMerge: true
        }),
    ],
    watch: {
        clearScreen: false,
    },
}
