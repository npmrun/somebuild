
# build-lib

## 导览

该库主要是为了构建一个基本js库

## 安装

```
pnpm i @somebuild/build-lib -D
```

## 使用说明

目前版本需要在根目录下的`package.json`中定义一个`buildinfo`字段，其类型如下：

```ts
interface IBuildInfoTsup {
    engine?: 'tsup' // 使用tsup引擎，后续可能会有其他编译器加入
    mode: 'lib' // 表明是库模式
    outDir: string // 编译后输出的位置
    name: string // 该库的名字变量
    entry: string[] | Record<string, string> | string // 库的入口
}
```

作为开箱即用的工具，做的不够好，目前最好都定义一下这几个字段：

```json
{
    engine: "tsup",
    mode: "lib",
    outDir: "./dist",
    name: allinfo.pkgInfo.name,
    entry: "./src/index.ts"
}
```

## 定义一个命令行

此模式上面的字段都一样，但是需要在根目录创建一个`somebuild.config.mts`文件，其内容如下：

```ts
import { defineRootConfig } from 'somebuild'
import { defineConfig as defineLibConfig } from '@somebuild/build-lib'

export default defineRootConfig({
    lib: defineLibConfig({
        bin: true // 此时，会在输出的文件中添加 #!/usr/bin/env node
    }),
})
```
