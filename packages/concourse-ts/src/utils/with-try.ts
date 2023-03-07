import {TryStep} from '../components/step'
import {AnyStep} from '../declarations'

export const with_try_catch = (
  tryStep: AnyStep,
  catchStep?: AnyStep,
  finallyStep?: AnyStep
) => {
  return new TryStep(`${tryStep.name}_try`, (ts) => {
    ts.set_try(tryStep)

    if (catchStep) ts.add_on_error(catchStep)

    if (finallyStep) ts.add_ensure(finallyStep)
  })
}
