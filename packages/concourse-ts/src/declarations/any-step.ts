import {Step} from '../components/step/base'
import * as Type from './types'

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
