import { execa } from 'execa'

const argv = process.argv.slice(2)
if (argv.length && argv[0]) {
    execa('turbo', ['run', 'dev', '--filter', `@somebuild/build-${argv[0]}`], {
        stdio: 'inherit',
    })
}
