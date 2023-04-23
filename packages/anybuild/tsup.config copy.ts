import { defineConfig } from 'tsup'
import pkg from './package.json'
import rootPkg from '../../package.json'
import { getPackages, getPackagesSync } from "@manypkg/get-packages";
import path from 'path';

export default defineConfig((options) => {
    const isDev = options.watch
    // 将依赖中的依赖一并加入
    const dependencies = pkg['dependencies'] ?? {}
    let externals = Array.from(
        new Set([
            ...Object.keys(dependencies),
            // ...Object.keys(devDependencies),
            // ...Object.keys(peerDependencies),
        ])
    )
    const rootDependencies = (rootPkg as any)['dependencies'] ?? {}
    externals = externals.concat(
        Array.from(
            new Set([
                ...Object.keys(rootDependencies),
            ])
        )
    )
    externals = [...new Set(externals)]
            console.log(externals);
            
    const { packages } = getPackagesSync(path.resolve(__dirname, "../../"));
    const all = packages.forEach(pkg =>{
        const dependencies = pkg.packageJson['dependencies'] ?? {}

    })
    console.log(packages);
    
    return {
        entry: {
            anybuild: 'src/index.ts',
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
        banner: { js: '#!/usr/bin/env node' },
        external: externals,
        minify: !isDev,
    }
})
