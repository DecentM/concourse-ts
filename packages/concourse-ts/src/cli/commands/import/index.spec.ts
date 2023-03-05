import anyTest, {TestFn} from 'ava'
import path from 'path'
import {tmpName} from 'tmp-promise'

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

  import_command.on('error', (error) => {
    t.fail(error.stack)
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
