import test from 'ava'
import {Type} from '../..'
import {Identifier} from '../identifier'

import {visit_pipeline} from './pipeline'

test('finds resources', (t) => {
  const r: Type.Resource = {
    type: 'registry-image' as Identifier,
    name: 'r' as Identifier,
    source: {},
  }

  const pipeline: Type.Pipeline = {
    resources: [r],
    jobs: [],
  }

  const found_resources: Type.Resource[] = []

  visit_pipeline(pipeline, {
    Resource: (resource) => {
      found_resources.push(resource)
    },
  })

  t.deepEqual(found_resources, [r])
})

test('finds resource_types', (t) => {
  const rt: Type.ResourceType = {
    type: 'registry-image' as Identifier,
    name: 'r' as Identifier,
    source: {},
  }

  const pipeline: Type.Pipeline = {
    resource_types: [rt],
    jobs: [],
  }

  const found_resource_types: Type.ResourceType[] = []

  visit_pipeline(pipeline, {
    ResourceType: (resource) => {
      found_resource_types.push(resource)
    },
  })

  t.deepEqual(found_resource_types, [rt])
})

test('finds jobs', (t) => {
  const j: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
  }

  const pipeline: Type.Pipeline = {
    jobs: [j],
  }

  const found_jobs: Type.Job[] = []

  visit_pipeline(pipeline, {
    Job: (job) => {
      found_jobs.push(job)
    },
  })

  t.deepEqual(found_jobs, [j])
})
