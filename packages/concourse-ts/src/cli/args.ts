import meow from 'meow'
import path from 'node:path'

import {AppCommand, AppProps} from './app'

export const parseProps = async (argv: string[]): Promise<AppProps> => {
  const cliName = path.parse(process.argv0).name

  const cli = meow(
    `
      Usage
        $ ${cliName} [command] [flags]

      Options
        --input, -i             Glob of .ts files containing a default export of a function that returns a Pipeline
        --output-directory, -o  The directory to output all pipelines to
        --extract-tasks, -e     If set, tasks within the pipeline will be extracted and replaced with a file reference

      Examples
        $ ${cliName} compile -i ci/pipelines/*.ts -o .ci

        $ ${cliName} compile -i ./**/*.pipeline.ts -e
    `,
    {
      importMeta: {
        url: path.resolve(__dirname, '../../package.json'),
      },

      argv,

      flags: {
        'input': {
          type: 'string',
          alias: 'i',
          isRequired: true,
        },

        'output-directory': {
          type: 'string',
          alias: 'o',
          default: '.',
        },

        'extract-tasks': {
          type: 'boolean',
          alias: 'e',
          default: false,
        },
      },
    }
  )

  return {
    command: cli.input[0] as AppCommand,
    options: {
      input: cli.flags.input,
      output_directory: cli.flags.outputDirectory,
      extract_tasks: cli.flags.extractTasks,
    },
  }
}
