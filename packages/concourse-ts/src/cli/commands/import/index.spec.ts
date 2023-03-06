import anyTest, {TestFn} from 'ava'
import path from 'path'
import {tmpName} from 'tmp-promise'
import {mkdirp} from 'mkdirp'

import {Import} from '.'

const test = anyTest as TestFn<{tmp_dir: string}>

test.beforeEach('temp directory', async (t) => {
  const tmp_path = await tmpName()

  t.context = {
    tmp_dir: tmp_path,
  }
})

test('compiles pipeline', async (t) => {
  const import_command = new Import({
    input: path.join(__dirname, 'test-data/good.yml'),
    package_path: '@decentm/concourse-ts',
    output_directory: t.context.tmp_dir,
  })

  let output_count = 0

  import_command.on('output', (file) => {
    t.log(file)
    output_count++
  })

  import_command.on('end', () => {
    t.is(output_count, 1)
  })

  await import_command.run()
})

test('refuses to write into existing output direcotry', async (t) => {
  await mkdirp(t.context.tmp_dir)

  const compile = new Import({
    input: path.join(__dirname, 'test-data/good.yml'),
    package_path: '@decentm/concourse-ts',
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

test('refuses inputs that match no files', async (t) => {
  const compile = new Import({
    input: './no-file.yml',
    package_path: '@decentm/concourse-ts',
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.is(event_error.message, 'Glob input "./no-file.yml" matched no files')
  })

  await compile.run()
})

test('refuses inputs that match corrupt yml files', async (t) => {
  const compile = new Import({
    input: path.join(__dirname, 'test-data/corrupt.yml'),
    package_path: '@decentm/concourse-ts',
    output_directory: t.context.tmp_dir,
  })

  compile.on('error', (event_error) => {
    t.assert(
      event_error.message.includes(
        'Nested mappings are not allowed in compact mappings'
      )
    )
  })

  await compile.run()
})
