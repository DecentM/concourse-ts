import {Step} from './_base'
import * as Type from '../../declarations/types'

export {GetStep} from './get'
export {PutStep} from './put'
export {TaskStep} from './task'
export {SetPipelineStep} from './set-pipeline'
export {LoadVarStep} from './load-var'
export {InParallelStep} from './in-parallel'
export {DoStep} from './do'
export {TryStep} from './try'

/**
 * AnyStep will match any of the `*Step` components.
 *
 * {@link GetStep}
 *
 * {@link PutStep}
 *
 * {@link TaskStep}
 *
 * {@link SetPipelineStep}
 *
 * {@link LoadVarStep}
 *
 * {@link InParallelStep}
 *
 * {@link DoStep}
 *
 * {@link TryStep}
 */
export type AnyStep = Step<Type.Step>
