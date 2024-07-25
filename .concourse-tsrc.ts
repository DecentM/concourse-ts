export default {
  compile: {
    input: 'ci/pipeline/concourse-ts.pipeline.ts',
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
          limit: 1,
        },
      },
    },
  },
}
