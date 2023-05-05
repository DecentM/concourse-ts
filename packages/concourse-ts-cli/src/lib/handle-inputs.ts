import fsp from 'node:fs/promises'

import glob from 'fast-glob'

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

export const handle_inputs = async (params: HandleInputParams): Promise<Input[]> => {
  if (typeof params.input === 'string') {
    const globs = await glob(params.input, {
      cwd: process.cwd(),
      absolute: true,
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

  const content = await read_stream(process.stdin)

  return [
    {
      filepath: null,
      content,
    },
  ]
}
