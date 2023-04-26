import { Command } from 'commander'
import { error } from '@anybuild/utils'
import { buildinfo } from '@anybuild/shared'

export * from '@anybuild/shared'
export * from '@anybuild/check'
export * from '@anybuild/utils'

const program = new Command()

program.name(__NAME__)
program.version(__VERSION__, '-v, --version').description('查看当前版本号')
program.helpOption('-h --help', '显示帮助信息')
program.showHelpAfterError(`(${__NAME__} -h 查看帮助信息)`)

let reportErrorMessage

try {
    await import('@anybuild/check')
} catch (error) {
    reportErrorMessage = error.message
}

program
    .option('-w, --watch', '开发模式')
    .option('-s, --site', '站点模式')
    .option('--ssr', 'ssr模式')
    .option('-d, --debug [value]', 'Debug日志')
    .description('构建')
    .action(async ({ watch, debug, site, ssr }) => {
        // 如果不存在buildinfo字段则报错
        if (reportErrorMessage) {
            error(reportErrorMessage, 'exit')
        }
        if (debug) {
            // 开启日志
            process.env.DEBUG = typeof debug === 'boolean' ? '*' : debug
        }
        const isDev = !!watch
        buildinfo.watch = isDev
        switch (buildinfo.mode) {
            case 'lib':
                try {
                    const { default: build } = await import(
                        '@anybuild/build-lib'
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
    .action(async ({}) => {
        error('开发中，暂不可用')
    })

program.parse(process.argv)
