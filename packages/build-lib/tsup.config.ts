import { externalsSetting } from '../setting'
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
            ...Object.keys(pkg['devDependencies'] ?? {}),
            ...Object.keys(rootPkg['dependencies'] ?? {}),
            ...Object.keys(rootPkg['peerDependencies'] ?? {}),
            ...Object.keys(rootPkg['optionalDependencies'] ?? {}),
            ...Object.keys(rootPkg['devDependencies'] ?? {}),
        ])
    )
    return {
        entry: {
            ['build-lib']: 'src/index.ts',
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
