import { createServer } from 'vite'
import { getConfig } from '../shared'

export * from '../shared'

export default async function () {
    const config = getConfig()
    
    // const viteConfig = await getDevVue3ComponetsConfig()
    const server = await createServer({
        logLevel: 'info',
        server: {
            port: 3366,
            host: '0.0.0.0',
        },
    })
    await server.listen()
    server.printUrls()
}
