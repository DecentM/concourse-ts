import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'

export const getArgv = (argv: string[]) => {
  return yargs(hideBin(argv))
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
}
