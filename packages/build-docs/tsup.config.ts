import { defineConfig } from 'tsup'
import pkg from './package.json'
import rootPkg from '../../package.json'

export default defineConfig((options) => {
    const isDev = options.watch
    let externals = Array.from(
        new Set([
            ...Object.keys(pkg['dependencies'] ?? {}),
            ...Object.keys(pkg['peerDependencies'] ?? {}),
            ...Object.keys(pkg['optionalDependencies'] ?? {}),
            ...Object.keys(rootPkg['dependencies'] ?? {}),
            ...Object.keys(rootPkg['peerDependencies'] ?? {}),
            ...Object.keys(rootPkg['optionalDependencies'] ?? {}),
        ])
    )
    return {
        entry: {
            ['build-docs']: 'src/node/index.ts',
        },
        format: 'esm', //isDev ? 'esm' : ['esm', 'cjs'],
        dts: true,
        silent: isDev as boolean,
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
