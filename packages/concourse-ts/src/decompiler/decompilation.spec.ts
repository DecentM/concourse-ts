import test from 'ava'
import fs from 'node:fs/promises'
import path from 'node:path'

import {Decompilation} from '.'

const check = (decompilation: Decompilation, yaml: string): boolean => {
  return !decompilation.decompile(yaml).pipeline.includes('undefined')
}

test('decompiles normally', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  decompilation
    .set_name('pipeline')
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.notThrows(() => {
    decompilation.decompile(file.toString('utf8'))
  })
})

test('decompiles without name', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  decompilation
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.notThrows(() => {
    decompilation.decompile(file.toString('utf8'))
  })
})

test('does not produce undefined assignments', async (t) => {
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  t.assert(
    check(
      new Decompilation()
        .set_name('pipeline')
        .set_work_dir('src/decompiler/test'),
      file.toString('utf8')
    ),
    'result contains undefined'
  )
})

test('throws when input is not a pipeline', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(
    path.resolve(__dirname, 'test/not-pipeline.yml')
  )

  decompilation
    .set_name('pipeline')
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.throws(
    () => {
      decompilation.decompile(file.toString('utf8'))
    },
    {
      message: 'Input is not a pipeline!',
    }
  )
})
