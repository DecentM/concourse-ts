import test from 'ava'

import { ConcoursePipelineResource } from './resource'
import { ConcoursePipelineResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcoursePipelineResourceType('my-concourse-pipeline-resource_type')
  const r = new ConcoursePipelineResource('my-concourse-pipeline-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-pipeline-resource')
})
