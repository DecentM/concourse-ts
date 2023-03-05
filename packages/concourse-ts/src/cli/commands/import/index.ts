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

    const output_dir = path.resolve(this.params.output_directory)

    if (existsSync(output_dir)) {
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
          const path_info = path.parse(file)

          decompilation
            .set_import_path(this.params.package_path)
            .set_name(path_info.name)
            .set_input(file_contents.toString('utf-8'))
            .set_prettier_config()
            .set_work_dir(path_info.dir)

          const decompile_result = decompilation.decompile()
          const output_path = path.resolve(
            output_dir,
            decompile_result.filename
          )

          decompile_result.warnings.get_warnings().forEach((warning) => {
            this.emit('warning', warning)
          })

          await mkdirp(output_dir)
          await fs.writeFile(output_path, decompile_result.pipeline)

          this.emit('output', output_path)
        } catch (error) {
          this.emit('error', error)
        }
      })
    )

    this.emit('end')
  }
}
