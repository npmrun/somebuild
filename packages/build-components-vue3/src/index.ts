import { getSomeBuildConfigCwd } from './shared'
import { createServer, build as viteBuild } from 'vite'

export default async function () {
    const config = getSomeBuildConfigCwd()
    console.log(config);
    // const alias = config.config.alias
}
