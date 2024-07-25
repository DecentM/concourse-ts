import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../index.js'
import { Identifier } from '../../utils/index.js'

import { write_job } from './job.js'

import {
  default_job,
  default_load_var_step,
  default_step,
} from '../../components/step/test-data/default-steps.js'

const chain = async (input: Type.Job, pipeline: Type.Pipeline) => {
  const code = `
    import {Job, LoadVarStep} from '../../components/index.js'

    export default ${write_job(input.name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  const loaded = await tsImport(tmpPath, import.meta.url)

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result: loaded.default, code }
}

test('writes empty job', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), { ...default_job, ...job })
})

test('writes plan', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [
      {
        load_var: 'asd' as Identifier,
        file: 'my-file',
      },
    ],
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes build_log_retention', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    build_log_retention: {
      builds: 1,
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes disable_manual_trigger', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    disable_manual_trigger: true,
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes interruptible', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    interruptible: false,
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes max_in_flight', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    max_in_flight: 8,
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes old_name', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    old_name: 'jo' as Identifier,
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes on_success', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_success: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes on_error', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_error: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes on_failure', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_failure: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes on_abort', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    on_abort: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes ensure', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    ensure: {
      load_var: 'asd' as Identifier,
      file: 'my-file',
    },
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
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

test('writes public', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    public: true,
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})

test('writes serial_groups', async (t) => {
  const job: Type.Job = {
    name: 'j' as Identifier,
    plan: [],
    serial_groups: ['asd' as Identifier],
  }

  const { result } = await chain(job, { jobs: [job] })

  t.deepEqual(result?.serialise(), {
    ...default_job,
    ...job,
  })
})
