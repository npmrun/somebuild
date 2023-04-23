import { Command } from 'commander'
import { error, logRed } from '@anybuild/utils'
import { createRequire } from 'node:module'

const program = new Command()

program.name(__NAME__)
program.version(__VERSION__, '-v, --version').description('查看当前版本号')
program.helpOption('-h --help', '显示帮助信息')
program.showHelpAfterError(`(${__NAME__} -h 查看帮助信息)`)

let reportErrorMessage

try {
    await import('@anybuild/check')
    reportErrorMessage = undefined
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
        if (reportErrorMessage) {
            error(reportErrorMessage, "exit")
        }
    })

program
    .command('init')
    .description('初始化项目')
    .action(async ({}) => {
        error('开发中，暂不可用')
    })

program.parse(process.argv)
