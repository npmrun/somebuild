import { build } from 'tsup'

const pkg = require(`../packages/somebuild/package.json`)
const isDev = true
const dependencies = pkg['dependencies'] ?? {}
let externals = Array.from(new Set([...Object.keys(dependencies)]))
externals = externals.concat([
    'commander',
    'chalk',
    'fs-extra',
    '@niu-tools/core',
    'somebuild',
    '@somebuild/build-lib',
    '@somebuild/build-docs',
    '@somebuild/build-component-vue3',
    '@noderun/loadconfig',
])

build({
    entry: {
        bin: 'packages/somebuild/src/index.ts',
    },
    outDir: "packages/somebuild/dist",
    watch: isDev,
    format: 'esm', //isDev ? 'esm' : ['esm', 'cjs'],
    dts: true,
    tsconfig: "tsconfig.build.json",
    splitting: false,
    sourcemap: true,
    clean: true,
    outExtension({ format }) {
        return {
          js: `.js`,
        }
    },
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
