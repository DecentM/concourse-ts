import { VError } from 'verror'
import fs from 'node:fs'
import path from 'node:path'

export const is_shebang = (line: string) => {
  return line.startsWith('#!')
}

export const parse_shebang = (shebang: string) => {
  if (!is_shebang(shebang)) {
    return {
      path: '',
      args: [],
    }
  }

  const cmdline = shebang.slice(2)
  const [path, ...args] = cmdline.split(' ')

  return {
    path,
    args,
  }
}

export const import_script = (filePath: string) => {
  const pathInfo = path.parse(filePath)
  const fullPath = path.resolve(filePath)

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

  if (!shebang.path) {
    throw new VError(
      `Script "${pathInfo.base}" cannot be imported, because its shebang does not define a binary (for example: #!/bin/sh)`
    )
  }

  return {
    path: shebang.path,
    args: shebang.args,
    script: scriptLines.join('\n'),
  }
}
