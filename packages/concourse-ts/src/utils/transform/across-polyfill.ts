import clone_deep from 'lodash.clonedeep'

import {
  Across,
  InParallelConfig,
  Pipeline,
  Step,
  Transformer,
} from '../../declarations/index.js'

import { visit_variable_attributes } from '../../utils/visitors/variable-attributes.js'

import { visit_pipeline } from '../visitors/pipeline.js'
import { visit_step } from '../visitors/step.js'

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
    const chain: T[] = Array.from({ length: enumerables.length })
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
  combination_item: CombinationItem[]
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

    const item = combination_item.find((member) => member.name === matched_fragment)

    if (
      // Filter out variable names not in the matrix
      !item ||
      // Filter out variables used from non-local var_sources
      matched_var_source_name !== '.'
    ) {
      continue
    }

    wip =
      wip.substring(0, match.indices.groups['varsource'][0] - 2) +
      item.value +
      wip.substring(match.indices.groups['varname'][1] + 2)
  }

  return wip
}

const apply_across_polyfill_step = (
  step: Step,
  options: AcrossPolyfillOptions
): Step => {
  const steps: Step[] = []
  const combinations = across_combinations(step.across)

  combinations.forEach((combination_item) => {
    const vars: Record<string, string> = {}

    combination_item.forEach((member) => {
      vars[member.name] = member.value
    })

    const new_step = {
      ...clone_deep(step),
      across: undefined,
    }

    // Replace all instances of variable usage in this step and its children
    visit_variable_attributes(new_step, {
      Attribute(attribute, field_index, root) {
        root[field_index] = replace_variables(attribute, combination_item)
      },
    })

    steps.push(new_step)
  })

  return {
    in_parallel: {
      ...options.in_parallel,
      steps,
    },
  }
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
  visit_pipeline(pipeline, {
    Job(job) {
      job.plan.forEach((plan_step, plan_index) => {
        visit_step(
          plan_step,
          {
            Step(step, index, root) {
              if (step.across) {
                root[index] = apply_across_polyfill_step(step, options)
              }
            },
          },
          plan_index,
          job.plan
        )
      })
    },
  })
}
