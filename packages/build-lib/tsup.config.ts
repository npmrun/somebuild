import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig((options) => {
    const isDev = options.watch
    const dependencies = pkg['dependencies'] ?? {}
    let externals = Array.from(new Set([...Object.keys(dependencies)]))
    externals = externals.concat([
        'commander',
        'chalk',
        'fs-extra',
        '@niu-tools/core',
        'anybuild',
        '@anybuild/build-lib',
        '@anybuild/build-docs',
        '@noderun/loadconfig',
    ])
    return {
        entry: {
            ['build-lib']: 'src/index.ts',
        },
        format: 'esm', //isDev ? 'esm' : ['esm', 'cjs'],
        dts: true,
        silent: true,
        splitting: isDev ? false : true,
        outExtension({ format }) {
            return {
              js: `.js`,
            }
        },
        sourcemap: true,
        clean: true,
        define: {
            __DEV__: `${isDev}`,
            __NAME__: `"${pkg.name}"`,
            __VERSION__: `"${pkg.version}"`,
        },
        replaceNodeEnv: true,
        treeshake: true,
        external: externals,
        minify: !isDev,
    }
})
