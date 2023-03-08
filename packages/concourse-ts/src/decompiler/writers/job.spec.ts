import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Job} from '../../components'
import {Identifier} from '../../utils'

import {write_job} from './job'

const chain = (input: Type.Job, pipeline: Type.Pipeline) => {
  const code = `
    import {Job, LoadVarStep} from '../../components'

    ${write_job(input.name, input, pipeline)}
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

const default_job = {
  max_in_flight: undefined,
  plan: [],
  build_log_retention: undefined,
  build_logs_to_retain: undefined,
  disable_manual_trigger: undefined,
  ensure: undefined,
  interruptible: undefined,
  old_name: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  public: undefined,
  serial: undefined,
  serial_groups: [],
}

const default_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: [],
  timeout: undefined,
}

const default_load_var_step = {
  ...default_step,
  file: undefined,
  format: undefined,
  load_var: undefined,
  reveal: undefined,
}

test('writes empty job', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_job, ...job})
})

test('writes plan', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [
      {
        load_var: 'asd' as Identifier,
        file: 'my-file',
      },
    ],
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    plan: [
      {
        ...default_load_var_step,
        load_var: 'asd',
        file: 'my-file',
      },
    ],
  })
})

test('writes build_log_retention', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    build_log_retention: {
      builds: 1,
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes disable_manual_trigger', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    disable_manual_trigger: true,
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes interruptible', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    interruptible: false,
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes max_in_flight', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    max_in_flight: 8,
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes old_name', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    old_name: 'jo' as Identifier,
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes on_success', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_success: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    on_success: {
      ...default_step,
      do: [
        {
          ...default_load_var_step,
          file: 'my-file',
          load_var: 'asd',
        },
      ],
    },
  })
})

test('writes on_error', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_error: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    on_error: {
      ...default_step,
      do: [
        {
          ...default_load_var_step,
          file: 'my-file',
          load_var: 'asd',
        },
      ],
    },
  })
})

test('writes on_failure', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_failure: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    on_failure: {
      ...default_step,
      do: [
        {
          ...default_load_var_step,
          file: 'my-file',
          load_var: 'asd',
        },
      ],
    },
  })
})

test('writes on_abort', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_abort: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    on_abort: {
      ...default_step,
      do: [
        {
          ...default_load_var_step,
          file: 'my-file',
          load_var: 'asd',
        },
      ],
    },
  })
})

test('writes ensure', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    ensure: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
    ensure: {
      ...default_step,
      do: [
        {
          ...default_load_var_step,
          file: 'my-file',
          load_var: 'asd',
        },
      ],
    },
  })
})

test('writes public', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    public: true,
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})

test('writes serial_groups', (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    serial_groups: ['asd' as Identifier],
  }

  const {result, diagnostics} = chain(job, {jobs: [job]})

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_job,
    ...job,
  })
})
