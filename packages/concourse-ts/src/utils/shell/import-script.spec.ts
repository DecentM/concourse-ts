import test from 'ava'
import path from 'node:path'

import {import_script} from '.'

test('does not import scripts without shebang', (t) => {
  const fullPath = path.resolve(__dirname, 'test/script-no-shebang.sh')

  t.throws(() => import_script(fullPath))
})

test('does not import non-existent files', (t) => {
  const fullPath = path.resolve(__dirname, 'test/does_not_exist.sh')

  t.throws(() => import_script(fullPath))
})

test('does not import files with crlf', (t) => {
  const fullPath = path.resolve(__dirname, 'test/script.crlf.sh')

  t.throws(() => import_script(fullPath))
})

test('does not import files with missing path from shebang', (t) => {
  t.throws(() => import_script(path.resolve(__dirname, 'test/no-path.sh')), {
    message:
      'Script "no-path.sh" cannot be imported, because its shebang does not define a binary (for example: #!/bin/sh)',
  })

  t.deepEqual(
    import_script(path.resolve(__dirname, 'test/no-path-just-args.sh')),
    {
      path: '-e',
      args: [],
      script: '\necho This is a test\n',
    }
  )
})
