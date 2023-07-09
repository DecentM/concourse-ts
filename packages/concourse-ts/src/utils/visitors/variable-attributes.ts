import * as Type from '../../declarations/types'
import {Identifier} from '../identifier'
import {is_pipeline} from '../is-pipeline'
import {visit_pipeline} from './pipeline'
import {visit_step} from './step'

export type StringVisitor = {
  Attribute: (
    attribute: string,
    field_index: string | number,
    root:
      | Type.Task<Identifier, Identifier>
      | Type.TaskStep
      | Type.Resource
      | Type.Command
      | string[]
      | Type.EnvVars
      | Type.Config
      | Type.Version
  ) => void
}

/**
 * This visitor visits every attribute in a Step, or a Pipeline that can have
 * variable interpolation.
 *
 * https://concourse-ci.org/vars.html#dynamic-vars
 *
 * @param {Step | Pipeline} component The component to traverse
 * @param {StringVisitor} visitor
 */
export const visit_variable_attributes = (
  component: Type.Step | Type.Pipeline,
  visitor: StringVisitor
) => {
  if (is_pipeline(component)) {
    visit_pipeline(component, {
      Resource(resource) {
        if (resource.source) {
          Object.keys(resource.source).forEach((key) => {
            const value = resource.source[key]

            if (typeof value !== 'string') {
              return
            }

            visitor.Attribute(value, key, resource.source)
          })
        }

        if (resource.webhook_token) {
          visitor.Attribute(resource.webhook_token, 'webhook_token', resource)
        }
      },

      Job(job) {
        job.plan.forEach((step) => {
          visit_variable_attributes(step, visitor)
        })
      },
    })

    return
  }

  visit_step(component, {
    DoStep(ds) {
      ds.do.forEach((step) => {
        visit_variable_attributes(step, visitor)
      })
    },

    InParallelStep(ips) {
      if (Array.isArray(ips.in_parallel)) {
        ips.in_parallel.forEach((step) => {
          visit_variable_attributes(step, visitor)
        })

        return
      }

      ips.in_parallel.steps.forEach((step) => {
        visit_variable_attributes(step, visitor)
      })
    },

    PutStep(ps) {
      visitor.Attribute(ps.put, 'put', ps)

      if (ps.params) {
        Object.keys(ps.params).forEach((key) => {
          const param_value = ps.params[key]

          if (typeof param_value !== 'string') {
            return
          }

          visitor.Attribute(param_value, key, ps.params)
        })
      }
    },

    GetStep(gs) {
      visitor.Attribute(gs.get, 'get', gs)

      if (gs.params) {
        Object.keys(gs.params).forEach((key) => {
          const param_value = gs.params[key]

          if (typeof param_value !== 'string') {
            return
          }

          visitor.Attribute(param_value, key, gs.params)
        })
      }
    },

    TaskStep(ts) {
      visitor.Attribute(ts.task, 'task', ts)

      if (ts.params) {
        Object.keys(ts.params).forEach((key) => {
          visitor.Attribute(ts.params[key], key, ts.params)
        })
      }

      if (ts.file) {
        visitor.Attribute(ts.file, 'file', ts)
      }

      if (ts.config) {
        if (ts.config.caches)
          ts.config.caches.forEach((cache) =>
            visitor.Attribute(cache.path, 'path', cache)
          )

        if (ts.config.image_resource?.type) {
          visitor.Attribute(
            ts.config.image_resource.type,
            'type',
            ts.config.image_resource
          )
        }

        if (ts.config.image_resource?.version) {
          if (typeof ts.config.image_resource.version === 'string') {
            visitor.Attribute(
              ts.config.image_resource.version,
              'version',
              ts.config.image_resource
            )
          } else {
            Object.keys(ts.config.image_resource.version).forEach((key) => {
              const value = ts.config.image_resource.version[key]

              visitor.Attribute(value, key, ts.config.image_resource.version)
            })
          }
        }

        if (ts.config.image_resource?.source) {
          Object.keys(ts.config.image_resource.source).forEach((key) => {
            const value = ts.config.image_resource.source[key]

            if (typeof value !== 'string') {
              return
            }

            visitor.Attribute(value, key, ts.config.image_resource.source)
          })
        }

        if (ts.config.image_resource?.params) {
          Object.keys(ts.config.image_resource.params).forEach((key) => {
            const value = ts.config.image_resource.params[key]

            if (typeof value !== 'string') {
              return
            }

            visitor.Attribute(value, key, ts.config.image_resource.params)
          })
        }

        if (ts.config.inputs) {
          ts.config.inputs.forEach((input) => {
            visitor.Attribute(input.name, 'name', input)

            if (input.path) visitor.Attribute(input.path, 'path', input)
          })
        }

        if (ts.config.outputs) {
          ts.config.outputs.forEach((output) => {
            visitor.Attribute(output.name, 'name', output)

            if (output.path) visitor.Attribute(output.path, 'path', output)
          })
        }

        if (ts.config.params) {
          Object.keys(ts.config.params).forEach((key) => {
            visitor.Attribute(ts.config.params[key], key, ts.config.params)
          })
        }

        if (ts.config.run) {
          visitor.Attribute(ts.config.run.path, 'path', ts.config.run)

          if (ts.config.run.args)
            ts.config.run.args.forEach((arg, index) =>
              visitor.Attribute(arg, index, ts.config.run.args)
            )

          if (ts.config.run.dir)
            visitor.Attribute(ts.config.run.dir, 'dir', ts.config.run)

          if (ts.config.run.user)
            visitor.Attribute(ts.config.run.user, 'user', ts.config.run)
        }

        Object.keys(ts.config).forEach((key) => {
          const value = ts.config[key]

          if (typeof value !== 'string') {
            return
          }

          visitor.Attribute(value, key, ts.config)
        })
      }
    },
  })
}
