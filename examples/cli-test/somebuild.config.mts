import { defineRootConfig } from 'somebuild'
import { defineConfig as defineLibConfig } from '@somebuild/build-lib'

export default defineRootConfig({
    lib: defineLibConfig({}),
})
