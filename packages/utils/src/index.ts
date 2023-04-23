import chalk from 'chalk'

export function logRed(message: string) {
    console.error(chalk.bold.red(message))
}

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
