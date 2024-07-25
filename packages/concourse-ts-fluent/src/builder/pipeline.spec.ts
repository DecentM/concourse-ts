import test from 'ava'

import { PipelineBuilder } from './pipeline.js'

test('builds pipeline', (t) => {
  const pipeline = new PipelineBuilder()
    .name('test')
    .group((gb) => {
      gb.name('ag').job((j) => {
        j.name('aj')
      })
    })
    .job(() => {})
    .apply((p) => {
      p.set_background_image_url('a.jpg')
    })

  const result = JSON.parse(JSON.stringify(pipeline.build().serialise()))

  t.deepEqual(result, {
    display: {
      background_image: 'a.jpg',
    },
    groups: [
      {
        jobs: ['aj'],
        name: 'ag',
      },
    ],
    jobs: [
      {
        name: 'aj',
        plan: [],
      },
      {
        plan: [],
      },
    ],
  })
})

test('throws when building without a name', (t) => {
  const builder = new PipelineBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build pipeline without a name',
    }
  )
})
