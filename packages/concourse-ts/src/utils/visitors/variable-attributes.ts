import * as Type from '../../declarations/types.js'
import { Identifier } from '../identifier/index.js'
import { is_pipeline } from '../is-pipeline/index.js'
import { is_get_step, is_put_step, is_task_step } from '../step-type/index.js'
import { visit_pipeline } from './pipeline.js'
import { visit_step } from './step.js'

export type VariableAttributeVisitor = {
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
 * https://concourse-ci.org/docs/vars/#dynamic-vars
 *
 * @param {Step | Pipeline} component The component to traverse
 * @param {StringVisitor} visitor
 */
export const visit_variable_attributes = (
  component: Type.Step | Type.Pipeline,
  visitor: VariableAttributeVisitor
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
    Step(step) {
      if (is_put_step(step)) {
        visitor.Attribute(step.put, 'put', step)

        if (step.params) {
          Object.keys(step.params).forEach((key) => {
            const param_value = step.params[key]

            if (typeof param_value !== 'string') {
              return
            }

            visitor.Attribute(param_value, key, step.params)
          })
        }

        return
      }

      if (is_get_step(step)) {
        visitor.Attribute(step.get, 'get', step)

        if (step.params) {
          Object.keys(step.params).forEach((key) => {
            const param_value = step.params[key]

            if (typeof param_value !== 'string') {
              return
            }

            visitor.Attribute(param_value, key, step.params)
          })
        }

        return
      }

      if (is_task_step(step)) {
        visitor.Attribute(step.task, 'task', step)

        if (step.params) {
          Object.keys(step.params).forEach((key) => {
            visitor.Attribute(step.params[key], key, step.params)
          })
        }

        if (step.file) {
          visitor.Attribute(step.file, 'file', step)
        }

        if (step.config) {
          if (step.config.caches)
            step.config.caches.forEach((cache) =>
              visitor.Attribute(cache.path, 'path', cache)
            )

          if (step.config.image_resource?.type) {
            visitor.Attribute(
              step.config.image_resource.type,
              'type',
              step.config.image_resource
            )
          }

          if (step.config.image_resource?.version) {
            if (typeof step.config.image_resource.version === 'string') {
              visitor.Attribute(
                step.config.image_resource.version,
                'version',
                step.config.image_resource
              )
            } else {
              Object.keys(step.config.image_resource.version).forEach((key) => {
                const value = step.config.image_resource.version[key]

                visitor.Attribute(value, key, step.config.image_resource.version)
              })
            }
          }

          if (step.config.image_resource?.source) {
            Object.keys(step.config.image_resource.source).forEach((key) => {
              const value = step.config.image_resource.source[key]

              if (typeof value !== 'string') {
                return
              }

              visitor.Attribute(value, key, step.config.image_resource.source)
            })
          }

          if (step.config.image_resource?.params) {
            Object.keys(step.config.image_resource.params).forEach((key) => {
              const value = step.config.image_resource.params[key]

              if (typeof value !== 'string') {
                return
              }

              visitor.Attribute(value, key, step.config.image_resource.params)
            })
          }

          if (step.config.inputs) {
            step.config.inputs.forEach((input) => {
              visitor.Attribute(input.name, 'name', input)

              if (input.path) visitor.Attribute(input.path, 'path', input)
            })
          }

          if (step.config.outputs) {
            step.config.outputs.forEach((output) => {
              visitor.Attribute(output.name, 'name', output)

              if (output.path) visitor.Attribute(output.path, 'path', output)
            })
          }

          if (step.config.params) {
            Object.keys(step.config.params).forEach((key) => {
              visitor.Attribute(step.config.params[key], key, step.config.params)
            })
          }

          if (step.config.run) {
            visitor.Attribute(step.config.run.path, 'path', step.config.run)

            if (step.config.run.args)
              step.config.run.args.forEach((arg, index) =>
                visitor.Attribute(arg, index, step.config.run.args)
              )

            if (step.config.run.dir)
              visitor.Attribute(step.config.run.dir, 'dir', step.config.run)

            if (step.config.run.user)
              visitor.Attribute(step.config.run.user, 'user', step.config.run)
          }

          Object.keys(step.config).forEach((key) => {
            const value = step.config[key]

            if (typeof value !== 'string') {
              return
            }

            visitor.Attribute(value, key, step.config)
          })
        }

        return
      }
    },
  })
}
