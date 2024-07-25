import { Step } from '../components/step/base.js'
import * as Type from './types.js'

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
