import test from 'ava'
import path from 'node:path'
import fs from 'node:fs/promises'

import { import_script } from './index.js'

test('does not import scripts without shebang', (t) => {
  const fullPath = path.resolve(import.meta.dirname, 'test/script-no-shebang.sh')

  t.throws(() => import_script(fullPath), { any: true })
})

test('does not import non-existent files', (t) => {
  const fullPath = path.resolve(import.meta.dirname, 'test/does_not_exist.sh')

  t.throws(() => import_script(fullPath), { any: true })
})

test('does not import files with crlf', async (t) => {
  const fullPath = path.resolve(import.meta.dirname, 'test/script.crlf.sh')

  await fs.writeFile(fullPath, '#!/bin/sh\r\necho Hello!\r\n')

  t.throws(() => import_script(fullPath), { any: true })

  await fs.unlink(fullPath)
})

test('does not import files with missing path from shebang', (t) => {
  t.throws(
    () => import_script(path.resolve(import.meta.dirname, 'test/no-path.sh')),
    {
      any: true,
      message:
        'Script "no-path.sh" cannot be imported, because its shebang does not define a binary (for example: #!/bin/sh)',
    }
  )

  t.deepEqual(
    import_script(path.resolve(import.meta.dirname, 'test/no-path-just-args.sh')),
    {
      path: '-e',
      args: [],
      script: '\necho This is a test\n',
    }
  )
})
