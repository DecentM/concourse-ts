import test from 'ava'
import { DoStepBuilder } from './do'

test('builds', (t) => {
  const builder = new DoStepBuilder().name('my-do-step').do((s) => {
    s.get((gs) => gs.name('my-get-step'))
  })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    name: 'my-do-step',
    do: [
      {
        name: 'my-get-step',
      },
    ],
  })
})

test('throws when building without a name', (t) => {
  const builder = new DoStepBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build do step without a name',
    }
  )
})
