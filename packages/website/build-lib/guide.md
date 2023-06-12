
# build-lib

## 导览

该库主要是为了构建一个基本js库

## 安装

```
pnpm i @somebuild/build-lib -D
```

## 使用说明

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