import {run_app} from '.'

const main = async () => {
  await run_app({
    command: 'compile',
    options: {
      input: 'ci/**/*.pipeline.ts',
      extract_tasks: false,
      output_directory: '.ci',
    },
  })
}

main().catch(console.error)
