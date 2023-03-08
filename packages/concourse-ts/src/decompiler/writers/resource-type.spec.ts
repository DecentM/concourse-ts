import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Job} from '../../components'
import {Duration, Identifier} from '../../utils'

import {write_resource_type} from './resource-type'

const chain = (name: string, pipeline: Type.Pipeline) => {
  const code = `
    import {ResourceType} from '../../components'

    ${write_resource_type(name, pipeline)}
  `

  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const job: Job = eval(result.outputText)

  return {
    result: job.serialise(),
    diagnostics: result.diagnostics,
  }
}

const default_resource_type = {
  check_every: undefined,
  defaults: undefined,
  name: 'a',
  params: undefined,
  privileged: undefined,
  tags: undefined,
}

test("throws when resource type doesn't exist in the pipeline", (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [],
    jobs: [],
  }

  t.throws(() => chain('a', pipeline), {
    message: 'Resource type "a" does not exist in the pipeline',
  })
})

test('writes empty resource type', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes source', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
  })
})

test('writes check_every', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
        check_every: '1h' as Duration,
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
  })
})

test('writes defaults', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        defaults: {
          my_default: '1',
        },
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes params', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        params: {
          my_default: '1',
        },
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes privileged', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        privileged: true,
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes tags', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        tags: ['tag-a', 'tag-b'],
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})
