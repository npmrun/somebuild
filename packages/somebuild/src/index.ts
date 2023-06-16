import { Command } from 'commander'
import { getMode } from './check'
import { error, getSomeBuildConfigAsync } from './utils'

// export * from './shared'
export { getInfo } from './check'
export * from './utils'

const program = new Command()

program.name(__NAME__)
program.version(__VERSION__, '-v, --version').description('查看当前版本号')
program.helpOption('-h --help', '显示帮助信息')
program.showHelpAfterError(`(${__NAME__} -h 查看帮助信息)`)

program
    .command('preview')
    .option('--watch', 'watch模式')
    .option('--ssr [value]', 'ssr模式')
    .option('-d, --debug [value]', 'Debug日志')
    .description('构建静态文档网站')
    .action(async ({ watch, debug, ssr }) => {
        if (debug) {
            // 开启日志
            process.env.DEBUG = typeof debug === 'boolean' ? '*' : debug
        }
        const isDev = !!watch
        if (isDev) {
            process.env.WATCH = '1'
        } else {
            Reflect.deleteProperty(process.env, "WATCH")
        }
        await getSomeBuildConfigAsync()
        try {
            // @ts-ignore
            const { default: build } = await import('@somebuild/build-preview')
            build?.(!!ssr)
        } catch (error) {
            throw error
        }
    })

program
    .command('docs')
    .option('--watch', 'watch模式')
    .option('--ssr [value]', 'ssr模式')
    .option('-d, --debug [value]', 'Debug日志')
    .description('构建静态文档网站')
    .action(async ({ watch, debug, ssr }) => {
        if (debug) {
            // 开启日志
            process.env.DEBUG = typeof debug === 'boolean' ? '*' : debug
        }
        const isDev = !!watch
        if (isDev) {
            process.env.WATCH = '1'
        } else {
            Reflect.deleteProperty(process.env, "WATCH")
        }
        await getSomeBuildConfigAsync()
        try {
            // @ts-ignore
            const { default: build } = await import('@somebuild/build-docs')
            build?.(!!ssr)
        } catch (error) {
            throw error
        }
    })

program
    .command('build')
    .option('-w, --watch', '开发模式')
    .option('-s, --site', '站点模式')
    .option('--ssr', 'ssr模式')
    .option('-d, --debug [value]', 'Debug日志')
    .description('构建')
    .action(async ({ watch, debug, site, ssr }) => {
        // 如果不存在buildinfo字段则报错
        const mode = getMode()
        if (debug) {
            // 开启日志
            process.env.DEBUG = typeof debug === 'boolean' ? '*' : debug
        }
        const isDev = !!watch
        if (isDev) {
            process.env.WATCH = '1'
        } else {
            Reflect.deleteProperty(process.env, "WATCH")
        }
        await getSomeBuildConfigAsync()
        switch (mode) {
            case 'lib':
                try {
                    // @ts-ignore
                    const { default: build } = await import(
                        '@somebuild/build-lib'
                    )
                    build?.()
                } catch (error) {
                    throw error
                }
                break
            case 'component-vue3':
                try {
                    // @ts-ignore
                    const { default: build } = await import(
                        '@somebuild/build-component-vue3'
                    )
                    build?.()
                } catch (error) {
                    throw error
                }
                break
            case 'components-vue3':
                
                try {
                    // @ts-ignore
                    const { default: build } = await import(
                        '@somebuild/build-components-vue3'
                    )
                    build?.()
                } catch (error) {
                    throw error
                }
                break
            default:
                error('无正确匹配的mode')
                break
        }
    })

program
    .command('init')
    .description('初始化项目')
    .action(async ({ }) => {
        error('开发中，暂不可用')
    })

program.parse(process.argv)
// console.log(program);
