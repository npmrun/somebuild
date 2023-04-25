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
        '@anybuild/build-lib',
    ])
    return {
        entry: {
            bin: 'src/index.ts',
        },
        format: 'esm', //isDev ? 'esm' : ['esm', 'cjs'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        define: {
            __DEV__: `${isDev}`,
            __NAME__: `"${pkg.name}"`,
            __VERSION__: `"${pkg.version}"`,
        },
        replaceNodeEnv: true,
        treeshake: true,
        banner: { js: '#!/usr/bin/env node' },
        external: externals,
        minify: !isDev,
    }
})
