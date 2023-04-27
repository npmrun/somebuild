import { createServer } from 'vite'
import { getConfig } from '../shared'
import { getDevConfig } from './config'

export * from '../shared'

export default async function () {
    const config = getConfig()
    
    const viteConfig = await getDevConfig()
    const server = await createServer({
        ...viteConfig,
        logLevel: 'info',
        server: {
            port: 3366,
            host: '0.0.0.0',
        },
    })
    await server.listen()
    server.printUrls()
}
