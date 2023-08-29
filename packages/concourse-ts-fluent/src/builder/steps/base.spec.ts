import test from 'ava'
import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base'
import { AllStep } from '../step'

class TestStepBuilder extends StepBuilderBase<AllStep> {
  public override build(): AllStep {
    return new ConcourseTs.DoStep(this._name)
  }
}

test('overwrites step name', (t) => {
  const builder = new TestStepBuilder().name('ds1')

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    do: [],
    name: 'ds1',
  })
})
