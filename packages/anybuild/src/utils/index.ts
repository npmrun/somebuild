import chalk from 'chalk'

export * from "./config"

export function error(message: string, willExit?: 'exit') {
    if (willExit === 'exit') {
        // process.exit(-1)
        throw new Error(message)
    }else{
        console.error(chalk.bold.red(message))
    }
}

export function upperFirst(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'
export const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]'