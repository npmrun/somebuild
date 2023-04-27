import glob from "fast-glob";
import path from "path";
import type { Plugin } from "vite";
import fs from "fs-extra";

const virtualDesktopModuleId = 'siteinfo-shared';
const resolvedDesktopVirtualModuleId = `anybuild:${virtualDesktopModuleId}`;
// 考虑增加配置文件，修改时热更新
// https://juejin.cn/post/7075678169122439181#heading-7
// https://github.com/vitejs/vite-plugin-vue/search?q=import.meta.hot
export async function genDesktopFiles(): Promise<Plugin> {

    return {
        name: "vite-plugin(anybuild):gen-siteinfo",
        resolveId(id) {
            
            return null
        },
        load(id) {
            
        }
    }
}