import VError from 'verror'
import fs from 'node:fs'
import path from 'node:path'

import { Command } from '../../components/command.js'

import { is_shebang, parse_shebang } from './helpers.js'

/**
 * Imports a script from disk into a format usable in a Command.
 *
 * {@link Command:class}
 *
 * @param {string} file_path
 * @returns {ImportedScript}
 */
export const import_script = (file_path: string): Command => {
  const pathInfo = path.parse(file_path)
  const fullPath = path.resolve(file_path)

  if (!fs.existsSync(fullPath)) {
    throw new VError(`File does not exist at ${fullPath}`)
  }

  const fileContents = fs.readFileSync(fullPath).toString('utf-8')
  const [firstLine, ...scriptLines] = fileContents.split('\n')

  if (fileContents.includes('\r\n')) {
    throw new VError(
      `Script "${pathInfo.base}" cannot be imported, because it contains CRLF line endings.`
    )
  }

  if (!is_shebang(firstLine)) {
    throw new VError(
      `Script "${pathInfo.base}" cannot be imported, because it does not start with a shebang. (#!)`
    )
  }

  const shebang = parse_shebang(firstLine)

  if (!shebang.path || !shebang.path.startsWith('/')) {
    throw new VError(
      `Script "${pathInfo.base}" cannot be imported, because its shebang does not define a binary (for example: #!/bin/sh)`
    )
  }

  return new Command((command) => {
    command.set_path(shebang.path)
    command.add_args(...shebang.args)
    command.add_args(scriptLines.join('\n').trim())
  })
}
