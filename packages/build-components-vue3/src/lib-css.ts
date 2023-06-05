import type { ModuleNode, Plugin } from "vite";

export async function LibCss(): Promise<Plugin> {
    return {
        name: "lib-css",
        apply: 'build',
        enforce: 'post',
        async generateBundle(opts, bundle) {
            if (opts.format === 'es') {
                for (const file in bundle) {
                    const chunk = bundle[file];
                    if (chunk.type === 'chunk') {
                        // 打包es的包自动引入style/style.css文件
                        chunk.code = chunk.code.replace("\/\* empty css",
                            // remove css import while preserving source map location
                            (m) => `import "./style/style.css";\n/* empty css`);
                    }
                }
            }
            if (opts.format === 'cjs') {
                for (const file in bundle) {
                    const chunk = bundle[file];
                    if (chunk.type === 'chunk') {
                        // 打包es的包自动引入style/style.css文件
                        chunk.code = chunk.code.replace("\/\* empty css",
                            // remove css import while preserving source map location
                            (m) => `require("./style/style.css");\n/* empty css`);
                    }
                }
            }
        }
    }
}