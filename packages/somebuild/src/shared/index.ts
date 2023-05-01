import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '../')
export const srcDir = path.resolve(rootDir, './src')
export const distDir = path.resolve(rootDir, './dist')
export const htmlDir = path.resolve(rootDir, './html')
export const cwdDir = process.cwd()