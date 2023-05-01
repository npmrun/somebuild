import { getConfig } from "./config"
import { createServer, build as viteBuild } from "vite"
import { RollupWatcher } from "rollup"

export default async function () {
    const config = getConfig()
    const out = await viteBuild(getConfig())

    if (!!process.env.WATCH) {
        console.log('Rollup is watching for changes...');
        let watcher = out as RollupWatcher
        watcher.on('event', event => {
            switch (event.code) {
                case 'START':
                    console.info('Rebuilding...');
                    break;
                case 'BUNDLE_START':
                    console.info('Bundling...');
                    break;
                case 'BUNDLE_END':
                    console.info('Bundled!');
                    break;
                case 'END':
                    console.info('Done!');
                    break;
                case 'ERROR':
                    console.error("Rollup error: ", event);
            }
        });
    } else {
        console.log(`打包完成`)
    }
}