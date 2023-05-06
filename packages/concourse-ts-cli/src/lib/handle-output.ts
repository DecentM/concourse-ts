import fsp from 'node:fs/promises'
import path from 'node:path'

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as rimraf from 'rimraf'
import { mkdirp } from 'mkdirp'

export type HandleOutputParams = {
  output: string | number
  clean: boolean
}

const write_stream = (stream: NodeJS.WriteStream, content: string) =>
  new Promise<void>((resolve, reject) => {
    stream.write(Buffer.from(content, 'utf-8'), (error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })

export const handle_output = async (
  results: Array<{ filename: string; content: string }>,
  params: HandleOutputParams
) => {
  await Promise.all(
    results.map(async (result) => {
      if (typeof params.output === 'string') {
        const output_dir = path.resolve(params.output)

        if (params.clean) {
          rimraf.sync(output_dir)
        }

        const output_file = path.join(output_dir, result.filename)
        const output_file_info = path.parse(output_file)

        await mkdirp(output_file_info.dir)
        await fsp.writeFile(output_file, result.content)
        return
      }

      await write_stream(process.stdout, result.content)
    })
  )
}
