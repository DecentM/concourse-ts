import VError from 'verror'

import {CliCommand} from '../abstract'

import glob from 'fast-glob'
import fs from 'fs/promises'
import {existsSync} from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

import {Decompilation} from '../../../decompiler/decompilation'
import {ValidationWarning} from '../../../utils/warning-store'

export type ImportEventMap = {
  globs: (files: string[]) => void
  error: (error: VError) => void
  warning: (warning: ValidationWarning) => void
  output: (file: string) => void
  end: () => void
}

export type ImportParams = {
  output_directory?: string
  package_path: string
  input: string
}

export class Import extends CliCommand<ImportParams, ImportEventMap> {
  public async run(): Promise<void> {
    const globs = await glob(this.params.input, {
      cwd: process.cwd(),
    })

    this.emit('globs', globs)

    if (!globs || globs.length === 0) {
      this.emit('error', new VError('Glob input matched no files. Aborting.'))
      this.emit('end')
      return
    }

    const outputDir = path.resolve(this.params.output_directory)

    if (existsSync(outputDir)) {
      this.emit(
        'error',
        new VError(
          'Output directory already exists, refusing to override. Clean the output directory before compiling.'
        )
      )
      this.emit('end')
      return
    }

    await Promise.all(
      globs.map(async (file) => {
        try {
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

          decompile_result.warnings.get_warnings().forEach((warning) => {
            this.emit('warning', warning)
          })

          await mkdirp(outputDir)

          await fs.writeFile(
            path.resolve(outputDir, decompile_result.filename),
            decompile_result.pipeline
          )

          this.emit('output', file)
        } catch (error) {
          this.emit('error', error)
        }
      })
    )

    this.emit('end')
  }
}
