import { defineRootConfig } from 'somebuild'
import { defineConfig as defineDocsConfig } from '@somebuild/build-docs'
import { defineConfig as defineCompsonfig } from '@somebuild/build-components-vue3'

export default defineRootConfig({
    "components-vue3": defineCompsonfig({
        alias: {
            '@': './src'
        },
        vite: {
            plugins: [
            ]
        }
    }),
    docs: defineDocsConfig({
        alias: {
            '@': './src',
            'test-vue3-ui/dist': './src',
        },
        define: {
            __MD_MATCH__: "'@root/src/components/*/index.*.md'",
            __DEMO_MATCH__: "'@root/src/components/*/demo/*.vue'",
            __COMP_MATCH__: "'@root/src/components/*/index.ts'",
            __DOCS_MATCH__: "'@root/docs/*/*.md'",
        },
        vite: {
            plugins: [],
        },
    }),
})
