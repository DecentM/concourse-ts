import anyTest, {TestFn} from 'ava'
import path from 'path'
import {tmpName} from 'tmp-promise'
import rimraf from 'rimraf'

import {Compile} from '.'

const test = anyTest as TestFn<{tmp_dir: string}>

test.beforeEach('temp directory', async (t) => {
  const tmp_path = await tmpName()

  t.context = {
    tmp_dir: tmp_path,
  }
})

test.afterEach('remove test directory', async (t) => {
  await rimraf(t.context.tmp_dir)
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
    t.log(`Compilation succeeded, written to: ${file}`)
    output_count++
  })

  compile.on('end', () => {
    t.is(output_count, 1)
  })

  await compile.run()
})
