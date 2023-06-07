import { describe, expect, test, afterEach, vi } from 'vitest'
import mockFs from 'mock-fs'
import fs from 'fs-extra'

describe('suite', async () => {
    const check = await import('./index')
    afterEach(function () {
        mockFs.restore()
    })
    test('没有package.json', async () => {
        expect.assertions(1)
        mockFs({})
        expect(check.check).toThrow('不存在package.json')
    })
    test('package.json不存在buildinfo字段', async () => {
        expect.assertions(1)
        mockFs({
            'package.json': `{
                "name": "anybuild",
                "type": "module",
                "version": "0.0.1-beta.16",
                "main": "./dist/bin.js",
                "types": "./dist/bin.d.ts",
                "bin": {
                    "anybuild": "./dist/bin.js"
                },
                "files": [
                    "dist",
                    "html"
                ]
            }`,
        })
        expect(check.check).toThrow('package.json不存在buildinfo字段')
    })
    test('正常', async () => {
        expect.assertions(1)
        mockFs({
            'package.json': `{
                "name": "anybuild",
                "type": "module",
                "version": "0.0.1-beta.16",
                "main": "./dist/bin.js",
                "types": "./dist/bin.d.ts",
                "bin": {
                    "anybuild": "./dist/bin.js"
                },
                "buildinfo": {
                    "mode": "components-vue3",
                    "componentsName": "components",
                    "outDir": "./dist",
                    "entry": "./src"
                },
                "files": [
                    "dist",
                    "html"
                ]
            }`,
        })
        const result = check.check()
        expect(result.pkgInfo).toStrictEqual(fs.readJSONSync('package.json'))
    })
})
