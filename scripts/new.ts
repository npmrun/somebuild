import inquirer, { Answers, Question, QuestionCollection } from 'inquirer'
import writefile from './_writefile'

const defaultQuestion: Record<'ui' | 'cli' | 'package', Question<Answers>[]> = {
    cli: [],
    package: [
        {
            type: 'input',
            name: 'pkgName',
            message: '请输入包名',
            validate(input) {
                if (!input) {
                    return '请提供一个名字'
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'pkgDesc',
            message: '请输入包的大致描述',
        },
        {
            type: 'confirm',
            name: 'justName',
            message: '是否是纯包？(默认 N)',
            default: false,
        },
    ],
    ui: [
        {
            type: 'input',
            name: 'uiName',
            message: '请输入生成的文件夹名称',
            validate(input) {
                if (!input) {
                    return '请提供一个名字'
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'fileName',
            message: '请输入输出后的文件名称',
            validate(input) {
                if (!input) {
                    return '请提供一个名字'
                }
                return true
            },
        },
        {
            type: 'input',
            name: 'globalName',
            message: '请输入定义的全局变量名',
            validate(input) {
                if (!input) {
                    return '请提供一个名字'
                }
                return true
            },
        },
    ],
}

;(async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'temp',
            message: '请选择一个模板生成',
            choices: [
                { name: '包', value: 'package' },
                { name: '命令行', value: 'cli' },
                { name: '组件', value: 'ui' },
            ],
            default: 'package',
        },
        ...(Object.keys(defaultQuestion) as (keyof typeof defaultQuestion)[])
            .map((n) => {
                return defaultQuestion[n].map((v) => {
                    v.when = (answers: any) => answers['temp'] === n
                    return v
                })
            })
            .reduce((a, b) => {
                return a.concat(b)
            }, []),
    ])
    if (answers.temp === 'ui') {
        writefile(
            'template/ui',
            `packages/ui/${answers.uiName}`,
            answers,
            false
        )
    }
    if (answers.temp === 'package') {
        writefile(
            'template/package',
            `packages/${answers.pkgName}`,
            answers,
            false
        )
    }
})()
