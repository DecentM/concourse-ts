import fsp from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'

import { rimraf } from 'rimraf'
import { mkdirp } from 'mkdirp'

export type HandleOutputParams = {
  output: string | number
  clean: boolean
}

export const handle_output = async (
  results: Array<{ filename: string; content: string }>,
  params: HandleOutputParams
) => {
  await Promise.all(
    results.map(async (result) => {
      if (typeof params.output === 'string') {
        const output_path = path.resolve(params.output)

        if (params.clean) {
          await rimraf(output_path)
        }

        await mkdirp(output_path)
        await fsp.writeFile(path.join(output_path, result.filename), result.content)
        return
      }

      fs.writeFileSync(params.output, result.content, 'utf-8')
    })
  )
}
