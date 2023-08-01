import test from 'ava'
import {Type} from '../..'

import {visit_step} from './step'

const step: Type.DoStep = {
  do: [],
  on_abort: {
    do: [],
  },
  on_error: {
    do: [],
  },
  on_failure: {
    do: [],
  },
  on_success: {
    do: [],
  },
  ensure: {
    do: [],
  },
}

test('recurses into hooks', (t) => {
  let count = 0

  visit_step(step, {
    Step() {
      count++
    },
  })

  t.is(count, 6)
})
