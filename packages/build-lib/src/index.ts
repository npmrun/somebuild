import { isObject, isString } from 'anybuild'
import tsup, { Options } from 'tsup'
import {
    getAnybuildConfigAsync,
    getAnybuildConfig,
    getBuildinfo,
} from './shared'

export * from './shared'

export default async function () {
    await getAnybuildConfigAsync()

    const buildinfo = getBuildinfo()
    const _config = getAnybuildConfig()?.config ?? {}
    const isDev = buildinfo.watch

    if (_config.overide) {
        // 只使用配置文件的配置
        tsup.build(_config)
        return
    }
    const commonOptions: Options = {
        // @ts-ignore
        entry:
            Array.isArray(buildinfo.entry) || isObject(buildinfo.entry)
                ? buildinfo.entry
                : isString(buildinfo.entry)
                ? buildinfo.name
                    ? {
                          [buildinfo.name]: buildinfo.entry,
                      }
                    : [buildinfo.entry]
                : buildinfo.entry,
        format: 'esm',
        dts: !isDev,
        outDir: buildinfo.outDir,
        splitting: !isDev,
        sourcemap: true,
        watch: isDev,
        clean: true,
        define: {
            __DEV__: `${isDev}`,
        },
        minify: !isDev,
        config: false,
    }
    if (!!_config.bin && !commonOptions.banner) {
        commonOptions.banner = { js: '#!/usr/bin/env node' }
    }
    tsup.build(Object.assign(commonOptions, {}, _config))
}
