import {AnyStep, TryStep} from '~/components/step'

export const with_try_catch = (
  tryStep: AnyStep,
  catchStep?: AnyStep,
  finallyStep?: AnyStep
) => {
  return new TryStep(`${tryStep.name}_try`, (ts) => {
    ts.set_try(tryStep)

    if (catchStep) ts.on_error = catchStep

    if (finallyStep) ts.ensure = finallyStep
  })
}
