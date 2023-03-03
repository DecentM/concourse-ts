import VError from 'verror'

import {CliCommand} from '../abstract'

import glob from 'fast-glob'
import fs from 'fs/promises'
import {existsSync} from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import {Decompilation} from '../../../decompiler/decompilation'

export type ImportEventMap = {
  start: () => void
  globs_resolved: (files: string[]) => void
  error: (error: VError) => void
  file_start: (file: string) => void
  file_error: (file: string, error: VError) => void
  file_success: (file: string) => void
  success: () => void
}

export type ImportParams = {
  output_directory?: string
  package_path: string
  input: string
}

export class Import extends CliCommand<ImportParams, ImportEventMap> {
  public async run(): Promise<void> {
    this.emit('start')

    const globs = await glob(this.params.input, {
      cwd: process.cwd(),
    })

    this.emit('globs_resolved', globs)

    const outputDir = path.resolve(this.params.output_directory)

    if (existsSync(outputDir)) {
      this.emit(
        'error',
        new VError(
          'Output directory already exists, refusing to override. Clean the output directory before compiling.'
        )
      )

      return
    }

    await Promise.all(
      globs.map(async (file) => {
        try {
          this.emit('file_start', file)

          const decompilation = new Decompilation()
          const file_contents = await fs.readFile(file)
          const pathInfo = path.parse(file)

          decompilation
            .set_import_path(this.params.package_path)
            .set_name(pathInfo.name)
            .set_input(file_contents.toString('utf-8'))
            .set_prettier_config()
            .set_work_dir(pathInfo.dir)

          const decompile_result = decompilation.decompile()

          await mkdirp(outputDir)

          await fs.writeFile(
            path.resolve(outputDir, decompile_result.filename),
            decompile_result.pipeline
          )

          this.emit('file_success', file)
        } catch (error) {
          this.emit('file_error', file, error)
        }
      })
    )

    this.emit('success')
  }
}
