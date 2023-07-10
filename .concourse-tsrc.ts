import { rc } from '@decentm/concourse-ts-cli'

export default rc({
  compile: {
    clean: true,
    input: 'ci/pipeline/concourse-ts.pipeline.ts',
    output: '.ci',
  },
  transform: {
    input: '.ci/pipeline/*.yml',
    output: '.ci/pipeline/',
    transformers: ['apply_across_polyfill'],
    options: {
      apply_across_polyfill: {
        in_parallel: {
          fail_fast: true,
          limit: 1,
        },
      },
    },
  },
})
