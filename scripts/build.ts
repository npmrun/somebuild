import { build } from 'tsup'

const pkg = require(`../packages/somebuild/package.json`)
const rootPkg = require(`../package.json`)
const isDev = false
let externals = Array.from(
    new Set([
        ...Object.keys(pkg['dependencies'] ?? {}),
        ...Object.keys(pkg['peerDependencies'] ?? {}),
        ...Object.keys(pkg['optionalDependencies'] ?? {}),
        ...Object.keys(pkg['devDependencies'] ?? {}),
        ...Object.keys(rootPkg['dependencies'] ?? {}),
        ...Object.keys(rootPkg['peerDependencies'] ?? {}),
        ...Object.keys(rootPkg['optionalDependencies'] ?? {}),
        ...Object.keys(rootPkg['devDependencies'] ?? {}),
    ])
)
build({
    entry: {
        bin: 'packages/somebuild/src/index.ts',
    },
    outDir: 'packages/somebuild/dist',
    watch: isDev,
    format: 'esm', //isDev ? 'esm' : ['esm', 'cjs'],
    dts: true,
    splitting: !isDev,
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
