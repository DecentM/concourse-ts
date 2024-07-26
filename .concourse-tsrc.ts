import { rc } from '@decentm/concourse-ts-cli'

export default rc({
  compile: {
    input: 'ci/pipelines/*/*.pipeline.ts',
    output: '.ci',
  },
  transform: {
    input: '.ci/pipeline/*.yml',
    output: '.ci/pipeline/',
    transformers: [],
    options: {
      apply_across_polyfill: {
        in_parallel: {
          fail_fast: true,
          limit: 5,
        },
      },
    },
  },
})
