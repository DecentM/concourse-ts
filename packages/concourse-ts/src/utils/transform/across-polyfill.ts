import clone_deep from 'lodash.clonedeep'

import {
  Across,
  InParallelConfig,
  Pipeline,
  Step,
  Transformer,
  TryStep,
  VarSource,
} from '../../declarations'

import {visit_variable_attributes} from '../../utils/visitors/variable-attributes'

import {visit_pipeline} from '../visitors/pipeline'
import {is_do_step, is_in_parallel_step, is_try_step} from '../step-type'

const get_combinations_rec = <T>(
  sources: T[][],
  chain: T[],
  index: number,
  combinations: T[][]
): void => {
  for (const element of sources[index]) {
    chain[index] = element

    if (index === sources.length - 1) {
      const final_chain = [...chain]
      combinations.push(final_chain)
    } else {
      get_combinations_rec(sources, chain, index + 1, combinations)
    }
  }
}

const get_combinations = <T>(enumerables: T[][]): T[][] => {
  const combinations: T[][] = []

  if (enumerables.length > 0) {
    const chain: T[] = Array.from({length: enumerables.length})
    get_combinations_rec(enumerables, chain, 0, combinations)
  }

  return combinations
}

type CombinationItem = {
  name: string
  value: string
}

const across_combinations = (acrosses: Across[]): CombinationItem[][] => {
  const combination_input = acrosses.map((across) =>
    across.values.map((value) => ({
      name: across.var,
      value,
    }))
  )

  return get_combinations(combination_input)
}

// Indices on regex match are a new proposal, so we need to extend the type
// https://stackoverflow.com/questions/72119570/why-doesnt-vs-code-typescript-recognize-the-indices-property-on-the-result-of-r
// https://tc39.es/proposal-regexp-match-indices/
type RegExpMatchArrayWithIndices = RegExpMatchArray & {
  indices: Array<[number, number]> & {
    groups: Record<string, [number, number]>
  }
}

export type AcrossPolyfillOptions = {
  in_parallel: Omit<InParallelConfig, 'steps'>
}

const replace_variables = (
  input: string,
  var_source_name: string,
  combination_item: CombinationItem[],
  replace_value?: boolean
): string => {
  const regex =
    /\(\((?<varsource>[a-zA-Z-.0-9]+):(?<varname>[a-zA-Z-.0-9]+)\)\)/dgimu

  let match: RegExpMatchArrayWithIndices | null = null
  let wip = input

  // The regex object tracks how many times it's been executed, and
  // matches the next occurrence every time. We use this to replace
  // every variable use in the string iteratively.
  while ((match = regex.exec(wip) as RegExpMatchArrayWithIndices) !== null) {
    const [, matched_var_source_name, matched_fragment] = match

    const item = combination_item.find(
      (member) => member.name === matched_fragment
    )

    if (
      // Filter out variable names not in the matrix
      !item ||
      // Filter out variables used from non-local var_sources
      matched_var_source_name !== '.'
    ) {
      continue
    }

    if (replace_value) {
      wip =
        wip.substring(0, match.indices.groups['varsource'][0] - 2) +
        item.value +
        wip.substring(match.indices.groups['varname'][1] + 2)
    } else {
      wip =
        wip.substring(0, match.indices.groups['varsource'][0]) +
        var_source_name +
        ':' +
        matched_fragment +
        wip.substring(match.indices.groups['varname'][1])
    }
  }

  return wip
}

const apply_across_polyfill_step = (
  step: Step,
  options: AcrossPolyfillOptions,
  path: Array<string | number>,
  root: Step[] | TryStep | Step
): VarSource[] => {
  const var_sources: VarSource[] = []
  const steps: Step[] = []

  if (step.across) {
    const combinations = across_combinations(step.across)

    combinations.forEach((combination_item, combination_index) => {
      const vars: Record<string, string> = {}

      combination_item.forEach((member) => {
        vars[member.name] = member.value
      })

      const new_step = {
        ...clone_deep(step),
        across: undefined,
      }

      const var_source_name = [...path, `across-${combination_index}`].join('_')

      // Replace all instances of variable usage in this step and its children
      visit_variable_attributes(new_step, {
        Attribute(attribute, field_index, root) {
          root[field_index] = replace_variables(
            attribute,
            var_source_name,
            combination_item,
            field_index === 'task'
          )
        },
      })

      steps.push(new_step)

      var_sources.push({
        type: 'dummy',
        name: var_source_name,
        config: {
          vars,
        },
      })
    })

    root[path[path.length - 1]] = {
      in_parallel: {
        ...options.in_parallel,
        steps,
      },
    }
  }

  if (is_do_step(step)) {
    step.do.forEach((substep, index) => {
      var_sources.push(
        ...apply_across_polyfill_step(
          substep,
          options,
          [...path, index],
          step.do
        )
      )
    })
  }

  if (is_in_parallel_step(step)) {
    ;(Array.isArray(step.in_parallel)
      ? step.in_parallel
      : step.in_parallel.steps
    ).forEach((substep, index) => {
      var_sources.push(
        ...apply_across_polyfill_step(
          substep,
          options,
          [...path, index],
          Array.isArray(step.in_parallel)
            ? step.in_parallel
            : step.in_parallel.steps
        )
      )
    })
  }

  if (is_try_step(step)) {
    var_sources.push(
      ...apply_across_polyfill_step(step.try, options, [...path, 'try'], step)
    )
  }

  if (step.on_abort) {
    var_sources.push(
      ...apply_across_polyfill_step(
        step.on_abort,
        options,
        [...path, 'on_abort'],
        step
      )
    )
  }

  if (step.on_success) {
    var_sources.push(
      ...apply_across_polyfill_step(
        step.on_success,
        options,
        [...path, 'on_success'],
        step
      )
    )
  }

  if (step.on_failure) {
    var_sources.push(
      ...apply_across_polyfill_step(
        step.on_failure,
        options,
        [...path, 'on_failure'],
        step
      )
    )
  }

  if (step.on_error) {
    var_sources.push(
      ...apply_across_polyfill_step(
        step.on_error,
        options,
        [...path, 'on_error'],
        step
      )
    )
  }

  return var_sources
}

/**
 * Modifies a serialised Pipeline *in-place*, so that all `across` modifiers are
 * removed from steps, and a new step is created for each combination of the
 * matrix under a new in_parallel step.
 *
 * This means that you can create build matrices even if your Concourse instance
 * doesn't have the `across` step enabled.
 *
 * @param {Pipeline} pipeline The pipeline to modify
 */
export const apply_across_polyfill: Transformer<AcrossPolyfillOptions> = (
  pipeline: Pipeline,
  options = {
    in_parallel: {
      fail_fast: true,
      limit: 1,
    },
  }
): void => {
  const var_sources: VarSource[] = []

  visit_pipeline(pipeline, {
    Job(job) {
      job.plan.forEach((plan_step, plan_index) => {
        var_sources.push(
          ...apply_across_polyfill_step(
            plan_step,
            options,
            [job.name, plan_index],
            job.plan
          )
        )
      })
    },
  })

  if (var_sources.length) {
    if (!pipeline.var_sources) pipeline.var_sources = []

    pipeline.var_sources.push(...var_sources)
  }
}
