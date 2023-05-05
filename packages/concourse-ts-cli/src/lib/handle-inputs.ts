import fsp from 'node:fs/promises'
import fs from 'node:fs'

import glob from 'fast-glob'

export type HandleInputParams = {
  input: string | number
}

export const handle_inputs = async (
  params: HandleInputParams
): Promise<Array<{ filepath: string; content: string }>> => {
  if (typeof params.input === 'string') {
    const globs = await glob(params.input, {
      cwd: process.cwd(),
    })

    if (!globs || globs.length === 0) {
      return []
    }

    return Promise.all(
      globs.map(async (file) => {
        const buffer = await fsp.readFile(file)

        return {
          filepath: file,
          content: buffer.toString('utf-8'),
        }
      })
    )
  }

  // If the input is not a string, treat it as if it was a file descriptor
  const content = fs.readFileSync(params.input, 'utf-8')

  return [
    {
      filepath: null,
      content,
    },
  ]
}
