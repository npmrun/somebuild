---
outline: deep
---

# 库

## 构建一个基本库

`package.json`
```ts
interface IBuildInfoTsup {
    engine?: 'tsup'
    mode: 'lib'
    outDir: string
    name: string
    entry: string[] | Record<string, string> | string
}
```

默认值
```json
{
    engine: "tsup",
    mode: "lib",
    outDir: "./dist",
    name: allinfo.pkgInfo.name,
    entry: "./src/index.ts"
}
```