import { buildinfo, pkgInfo } from '@anybuild/check'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '../')
export const htmlDir = path.resolve(rootDir, './html')
export const cwdDir = process.cwd()

const dependencies = pkgInfo['dependencies'] ?? {}
const devDependencies = pkgInfo['devDependencies'] ?? {}
const peerDependencies = pkgInfo['peerDependencies'] ?? {}
pkgInfo.globals = pkgInfo['globals'] ?? {}
pkgInfo.exclude = pkgInfo['exclude'] ?? []

const externals = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(peerDependencies),
].filter((v) => !pkgInfo.exclude.includes(v))

let globals: Record<string, string> = {}
externals.forEach((v) => {
    globals[v] = pkgInfo.globals[v] || v
})

export {
    buildinfo,
    externals,
    globals,
    dependencies,
    devDependencies,
    peerDependencies,
}
