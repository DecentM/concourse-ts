// import { rc } from '@decentm/concourse-ts-cli'
import { rc } from './src'

export default rc({
  compile: {
    clean: true,
  },
  decompile: {
    package: '@corpity-corp/ci',
  },
})
