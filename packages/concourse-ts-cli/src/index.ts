import VError from 'verror'

import { program } from './program'

const main = async () => {
  if (!process.argv.slice(2).length) {
    program.outputHelp()
    throw new VError('No command specified')
  }

  return await program.parseAsync(process.argv)
}

main().catch((error) => {
  process.exitCode = 1
  console.error('\n', 'Error:', error.message, '\n')
})
