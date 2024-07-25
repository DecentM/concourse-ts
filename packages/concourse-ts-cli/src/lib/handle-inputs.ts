import fsp from 'node:fs/promises'

import glob from 'fast-glob'
import tmp from 'tmp-promise'

export type HandleInputParams = {
  input: string | number
}

export type Input = {
  filepath: string | null
  content: string
}

const read_stream = async (stream: NodeJS.ReadStream) => {
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf-8')
}

export const handle_inputs = async (
  params: HandleInputParams,
  stdin_ext: string
): Promise<string[]> => {
  if (typeof params.input === 'string') {
    const globs = await glob(params.input, {
      cwd: process.cwd(),
      absolute: true,
    })

    if (!globs || globs.length === 0) {
      return []
    }

    return globs
  }

  const content = await read_stream(process.stdin)
  const tmp_file = await tmp.file({
    template: `change-me-XXXXXX${stdin_ext}`,
  })

  process.on('beforeExit', async () => {
    await tmp_file.cleanup()
  })

  await fsp.writeFile(tmp_file.path, content, 'utf-8')

  return [tmp_file.path]
}
