import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Job} from '../../components'
import {Duration, Identifier} from '../../utils'

import {write_resource} from './resource'

const chain = (name: string, pipeline: Type.Pipeline) => {
  const code = `
    import {Resource, ResourceType} from '../../components'

    ${write_resource(name, pipeline)}
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

const default_resource = {
  check_every: undefined,
  icon: undefined,
  name: 'a',
  old_name: undefined,
  public: undefined,
  source: undefined,
  tags: undefined,
  type: 'at',
  version: undefined,
  webhook_token: undefined,
}

const resource_type = {
  name: 'at' as Identifier,
  type: 'registry-image' as Identifier,
  source: {},
  defaults: {
    my_default: '1',
  },
}

test('writes empty resource', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
  })
})

test("throws if the resource doesn't exist", (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  t.throws(
    () => {
      chain('a', pipeline)
    },
    {
      message: 'Resource "a" does not exist in the pipeline',
    }
  )
})

test('writes source', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {
          a: 1,
        },
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: {a: 1},
  })
})

test('writes check_every', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        check_every: '1h' as Duration,
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    check_every: '1h',
  })
})

test('writes icon', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        icon: 'check',
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    icon: 'check',
  })
})

test('writes old_name', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        old_name: 'aon' as Identifier,
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    old_name: 'aon',
  })
})

test('writes public', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        public: false,
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    public: false,
  })
})

test('writes tags', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        tags: ['tag-a', 'tag-b'],
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    tags: ['tag-a', 'tag-b'],
  })
})

test('writes version', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        version: 'every',
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    version: 'every',
  })
})

test('writes webhook_token', (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        webhook_token: 'asdasd',
      },
    ],
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    webhook_token: 'asdasd',
  })
})
