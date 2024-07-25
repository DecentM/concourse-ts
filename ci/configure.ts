import * as ConcourseTs from '@decentm/concourse-ts'
import crypto from 'node:crypto'

ConcourseTs.Pipeline.customise((pipeline) => {
  pipeline.set_background_image_url(
    'https://bing.biturl.top/?resolution=1920&format=image'
  )
})

ConcourseTs.Job.customise((job) => {
  job.max_in_flight = 1
})

ConcourseTs.Resource.customise((r) => {
  r.webhook_token = crypto.createHash('sha256').update(r.name).digest('hex')
  r.set_check_every({ hours: 1 })
})

ConcourseTs.ResourceType.customise((rt) => {
  rt.set_check_every({ hours: 1 })
})

ConcourseTs.GetStep.customise((gs) => {
  gs.trigger = true
  gs.attempts = 3
  gs.set_timeout({ hours: 1 })
})

ConcourseTs.PutStep.customise((ps) => {
  ps.attempts = 2
  ps.set_timeout({ hours: 2 })
})

ConcourseTs.GetStep.customise_base((sb) => {
  sb.set_timeout({ hours: 6 })
})

ConcourseTs.LoadVarStep.customise((lvs) => {
  lvs.reveal = true
})

ConcourseTs.Command.customise((command) => {
  command.path = '/bin/sh'

  command.add_arg('-exuc')
})

ConcourseTs.Task.customise((task) => {
  task.platform = 'linux'

  task.set_image_resource({
    type: 'registry-image',
    source: {
      repository: 'alpine',
      tag: '3.20',
    },
  })
})
