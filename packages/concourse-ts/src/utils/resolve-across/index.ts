import clone_deep from 'lodash.clonedeep'

import {Across, Pipeline, Step} from '../../declarations'
import {visit_variable_attributes} from '../visitors/variable-attributes'

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

export const resolve_across_pipeline = (pipeline: Pipeline): void => {
  pipeline.jobs.forEach((job) => {
    job.plan.forEach((step, step_index) => {
      if (!step.across || !step.across.length) {
        return
      }

      const steps: Step[] = []
      const combinations = across_combinations(step.across)

      if (!pipeline.var_sources) {
        pipeline.var_sources = []
      }

      combinations.forEach((combination_item, combination_index) => {
        const vars: Record<string, string> = {}

        combination_item.forEach((member) => {
          vars[member.name] = member.value
        })

        const new_step = {
          ...clone_deep(step),
          across: undefined,
        }

        const var_source_name = `${job.name}_across_${combination_index}`

        // Replace all instances of variable usage in this step and its children
        visit_variable_attributes(new_step, {
          Attribute(attribute, field_index, root) {
            const regex = /(.*)\(\(\.:([a-zA-Z-.0-9]{0,})\)\)(.*)/g
            let match: RegExpExecArray | null = null

            // The regex object tracks how many times it's been executed, and
            // matches the next occurrence every time. We use this to replace
            // every variable use in the string iteratively.
            while ((match = regex.exec(attribute)) !== null) {
              if (
                !combination_item.some((member) => member.name === match[2])
              ) {
                return
              }

              root[
                field_index
              ] = `${match[1]}((${var_source_name}:${match[2]}))${match[3]}`
            }
          },
        })

        steps.push(new_step)

        pipeline.var_sources.push({
          type: 'dummy',
          name: var_source_name,
          config: {
            vars,
          },
        })
      })

      job.plan[step_index] = {
        in_parallel: steps,
      }
    })
  })
}
