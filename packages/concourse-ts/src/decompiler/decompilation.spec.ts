import test from 'ava'
import fs from 'node:fs/promises'
import path from 'node:path'

import {Decompilation} from './decompilation'

const check = (decompilation: Decompilation): boolean => {
  return !decompilation.decompile().pipeline.includes('undefined')
}

test('decompiles with prettier', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  decompilation
    .set_input(file.toString('utf8'))
    .set_name('pipeline')
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.notThrows(() => {
    decompilation.decompile()
  })
})

test('decompiles without prettier', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  decompilation
    .set_input(file.toString('utf8'))
    .set_name('pipeline')
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.notThrows(() => {
    decompilation.decompile()
  })
})

test('does not produce undefined assignments', async (t) => {
  const file = await fs.readFile(path.resolve(__dirname, 'test/pipeline.yml'))

  t.assert(
    check(
      new Decompilation()
        .set_name('pipeline')
        .set_input(file.toString('utf8'))
        .set_work_dir('src/decompiler/test')
    ),
    'result contains undefined'
  )
})

test('does not decompile without input', (t) => {
  const decompilation = new Decompilation()

  t.throws(() => decompilation.decompile(), {
    message: 'Cannot get result without input. Call set_input first!',
  })
})

test('does not allow setting the input twice', (t) => {
  const decompilation = new Decompilation().set_input('')

  t.throws(() => decompilation.set_input(''), {
    message:
      'This decompilation already has an input. Create a new decompilation.',
  })
})

test('throws when input is not a pipeline', async (t) => {
  const decompilation = new Decompilation()
  const file = await fs.readFile(
    path.resolve(__dirname, 'test/not-pipeline.yml')
  )

  decompilation
    .set_input(file.toString('utf8'))
    .set_name('pipeline')
    .set_import_path('@decentm/concourse-ts')
    .set_work_dir('src/decompiler/test')

  t.throws(
    () => {
      decompilation.decompile()
    },
    {
      message: 'Input is not a pipeline!',
    }
  )
})
