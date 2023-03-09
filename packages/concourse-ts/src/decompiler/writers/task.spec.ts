import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Task} from '../../components'
import {Identifier} from '../../utils'

import {write_task} from './task'

const chain = (name: string, input: Type.Task<Identifier, Identifier>) => {
  const code = `
    import {Task, Command} from '../../components'

    ${write_task(name, input)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: Task = eval(transpiled.outputText)

  return {
    result: result.serialise(),
    diagnostics: transpiled.diagnostics,
  }
}

const default_task = {
  caches: [],
  container_limits: undefined,
  image_resource: {
    source: {},
    type: 'registry-image',
  },
  inputs: undefined,
  outputs: undefined,
  params: undefined,
  platform: 'linux',
  rootfs_uri: undefined,
  run: {
    args: [],
    dir: undefined,
    path: 'echo',
    user: undefined,
  },
}

test('writes empty task', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_task)
})

test('writes caches', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    caches: [{path: 'my-cache'}],
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task,
    caches: [{path: 'my-cache'}],
  })
})

test('writes container_limits', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    container_limits: {
      cpu: 50,
      memory: 50_000,
    },
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task,
    container_limits: {
      cpu: 50,
      memory: 50_000,
    },
  })
})

test('writes inputs', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    inputs: [{name: 'my-input' as Identifier}],
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task,
    inputs: [{name: 'my-input'}],
  })
})

test('writes outputs', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    outputs: [{name: 'my-output' as Identifier}],
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task,
    outputs: [{name: 'my-output'}],
  })
})

test('writes params', (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    params: {
      my_param: '1',
    },
  }

  const {result, diagnostics} = chain('a', task)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_task,
    params: {
      my_param: '1',
    },
  })
})
