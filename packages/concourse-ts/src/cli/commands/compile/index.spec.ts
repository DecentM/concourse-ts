import anyTest, {TestFn} from 'ava'
import path from 'path'
import {tmpName} from 'tmp-promise'
import {mkdirp} from 'mkdirp'

import {Compile} from '.'

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

test('emits warnings', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/warnings.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  let ended = false
  let output_count = 0
  let warning_count = 0

  compile.on('output', (file) => {
    t.log(file)
    output_count++
  })

  compile.on('warning', (warning) => {
    t.assert(
      warning.messages[0].startsWith(
        'Command "which" uses a binary from $PATH!'
      )
    )
    warning_count++
  })

  compile.on('end', () => {
    ended = true
  })

  await compile.run()

  t.is(ended, true)
  t.is(output_count, 1)
  t.is(warning_count, 1)
})

test('refuses inputs that export non-functions', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/exports-number.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.assert(
      event_error.message.includes(
        'failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.'
      )
    )
  })

  await compile.run()
})

test('refuses inputs that export functions returning non-pipelines', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/returns-number.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.assert(
      event_error.message.includes(
        'failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.'
      )
    )
  })

  await compile.run()
})

test('refuses to write into existing output direcotry', async (t) => {
  await mkdirp(t.context.tmp_dir)

  const compile = new Compile({
    input: path.join(__dirname, 'test-data/good.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.assert(
      event_error.message.includes(
        'Output directory already exists, refusing to override'
      )
    )
  })

  await compile.run()
})

test('accepts inputs that export async functions', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/promise.pipeline.ts'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
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

test('refuses inputs that match no files', async (t) => {
  const compile = new Compile({
    input: 'test-data/good.pipeline.ts',
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.is(
      event_error.message,
      'Glob input "test-data/good.pipeline.ts" matched no files'
    )
  })

  await compile.run()
})

test('refuses inputs that resolve to non-typescript files', async (t) => {
  const compile = new Compile({
    input: path.join(__dirname, 'test-data/not-ts.txt'),
    extract_tasks: false,
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.assert(
      event_error.message.includes(
        'failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.'
      )
    )
  })

  await compile.run()
})
