import anyTest, {TestFn} from 'ava'
import path from 'path'
import {tmpName} from 'tmp-promise'

import {Compile} from '.'
import VError from 'verror'

const test = anyTest as TestFn<{tmp_dir: string}>

test.beforeEach('temp directory', async (t) => {
  const tmp_path = await tmpName()

  t.context = {
    tmp_dir: tmp_path,
  }
})

test('compiles pipeline', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/good.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (error) => {
    t.fail(error.stack)
  })

  let output_count = 0

  compile.on('output', (file) => {
    t.log(file)
    output_count++
  })

  compile.on('end', () => {
    t.is(output_count, 1)
  })

  await compile.run()
})

test('does not compile when export is not a function', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/exports-number.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  let error: VError | null = null

  compile.on('error', (event_error) => {
    error = event_error
  })

  compile.on('output', () => {
    t.fail('output written from invalid pipeline')
  })

  compile.on('end', () => {
    t.assert(
      error?.message.includes(
        'failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.'
      )
    )
  })

  await compile.run()
})

test('refuses to compile if input matches no files', async (t) => {
  const compile = new Compile({
    input: 'test-data/good.pipeline.ts',
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  await t.throwsAsync(() => compile.run(), {
    message: 'Glob input "test-data/good.pipeline.ts" matched no files',
  })
})
