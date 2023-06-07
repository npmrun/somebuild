import chalk from 'chalk'

export * from "./config"

/**
 * @internal
 */
export function error(message: string, willExit?: 'exit') {
    if (willExit === 'exit') {
        // process.exit(-1)
        throw new Error(message)
    }else{
        console.error(chalk.bold.red(message))
    }
}
/**
 * @internal
 */
export function upperFirst(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
/**
 * @internal
 */
export const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'
/**
 * @internal
 */
export const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]'