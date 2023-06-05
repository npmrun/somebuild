import { defineRootConfig } from 'somebuild'
import { defineConfig as defineDocsConfig } from '@somebuild/build-docs'

export default defineRootConfig({
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
