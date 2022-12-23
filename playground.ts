import {Pipeline, Task, Resource, ResourceType, compile} from './src'

export const pipeline = new Pipeline((pipeline) => {
  const rt = new ResourceType('test')
  const r = rt.create_resource('test')

  pipeline.add_resource(r)

  const t = new Task((task) => {
    task.add_input({
      name: 'testi',
      optional: false,
      path: './asd',
    })
  })

  /* pipeline.add_job({
    name: 'asd',
  }) */
})

console.log(compile(pipeline))
