import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { rimraf } from 'rimraf'
import glob from 'fast-glob'
import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { mkdirp } from 'mkdirp'
import * as YAML from 'yaml'

export type ImportEventMap = {
  globs: (files: string[]) => void
  error: (error: VError) => void
  warning: (warning: ConcourseTs.Utils.ValidationWarning) => void
  output: (file: string) => void
  end: () => void
}

export type TransformParams = {
  output?: string
  input?: string
  force?: boolean
  transformers?: string[]
}

const is_empty = (path: string) => {
  return fs.readdirSync(path).length === 0
}

const resolve_inputs = async (
  params: TransformParams
): Promise<Array<{ filepath: string; content: string }>> => {
  if (params.input) {
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

  const content = fs.readFileSync(process.stdin.fd, 'utf-8')

  return [
    {
      filepath: '',
      content,
    },
  ]
}

const handle_output = async (
  results: Array<{ filename: string; content: string }>,
  params: TransformParams
) => {
  await Promise.all(
    results.map(async (result) => {
      if (params.output) {
        const output_path = path.resolve(params.output)

        if (fs.existsSync(output_path) && !is_empty(output_path)) {
          if (params.force) {
            await rimraf(output_path)
          } else {
            throw new VError(
              `Output path "${output_path}" already exists. Pass "-f" to overwrite and clean the output path.`
            )
          }
        }

        await mkdirp(output_path)
        await fsp.writeFile(path.join(output_path, result.filename), result.content)
        return
      }

      fs.writeFileSync(process.stdout.fd, result.content, 'utf-8')
    })
  )
}

export const run_transform_command = async (params: TransformParams) => {
  const inputs = await resolve_inputs(params)

  const results = await Promise.all(
    inputs.map(async (input) => {
      const path_info = path.parse(input.filepath)
      const used_transformers = Object.keys(ConcourseTs.Utils.Transform).filter(
        (transformer) => {
          return params.transformers.includes(transformer)
        }
      )

      const pipeline = YAML.parse(input.content)

      used_transformers.forEach((used_transformer) => {
        const transformer: ConcourseTs.Type.Transformer =
          ConcourseTs.Utils.Transform[used_transformer]

        if (!transformer) {
          return
        }

        transformer(pipeline, path_info.dir)
      })

      return {
        filename: `${path_info.name}.yml`,
        content: YAML.stringify(pipeline),
      }
    })
  )

  await handle_output(results, params)
}
