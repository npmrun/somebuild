import { build } from 'tsup'

const pkg = require(`../packages/anybuild/package.json`)
const isDev = true
const dependencies = pkg['dependencies'] ?? {}
let externals = Array.from(new Set([...Object.keys(dependencies)]))
externals = externals.concat([
    'commander',
    'chalk',
    'fs-extra',
    '@niu-tools/core',
    '@anybuild/build-lib',
])

build({
    entry: {
        bin: 'packages/anybuild/src/index.ts',
    },
    outDir: "packages/anybuild/dist",
    watch: true,
    format: 'esm',
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
})
