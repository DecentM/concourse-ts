import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'
import {AppCommand, AppProps} from './app'

export const parseProps = async (argv: string[]): Promise<AppProps> => {
  const parsed = await yargs(hideBin(argv))
    .command('compile', 'compile pipelines', (yargs) => {
      return yargs
        .option('input', {
          alias: 'i',
          type: 'string',
          description:
            'Glob of .ts files containing a default export of a function that returns a Pipeline',
        })
        .option('output-directory', {
          alias: 'o',
          type: 'string',
          description: 'The directory to output all pipelines to',
        })
    })
    .parse()

  return {
    command: parsed._[0] as AppCommand,
    options: {
      input: parsed.input,
      outputDirectory: parsed.outputDirectory,
    },
  }
}
