import VError from 'verror'

import { get_program } from './program.js'

export { rc } from './rc.js'

const main = async () => {
  const program = await get_program()

  if (!process.argv.slice(2).length) {
    program.outputHelp()
    throw new VError('No command specified')
  }

  return await program.parseAsync(process.argv)
}

main().catch(console.error)
