import anyTest, {TestFn} from 'ava'

import {Step} from './base'

const test = anyTest as TestFn<{step: Step<never>}>

class TStep extends Step<never> {
  public get_resources() {
    return []
  }

  public get_task_steps() {
    return []
  }

  public serialise() {
    return this.serialise_base() as never
  }
}

test.beforeEach((t) => {
  t.context.step = new TStep('a')

  Step.customise_base((step) => {
    step.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  t.deepEqual(t.context.step.serialise(), {
    attempts: undefined,
    ensure: undefined,
    on_abort: undefined,
    on_error: undefined,
    on_failure: undefined,
    on_success: undefined,
    tags: undefined,
    timeout: undefined,
  })
})
