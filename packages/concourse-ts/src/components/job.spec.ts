import test from 'ava'
import {deduplicate_by_identity, Identifier} from '../utils'

import {Job} from './job'
import {Resource} from './resource'
import {ResourceType} from './resource-type'
import {DoStep, LoadVarStep} from './step'
import {Task} from './task'

Job.customise((job) => {
  job.max_in_flight = 2
})

const default_job = {
  max_in_flight: 2,

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
  serial_groups: undefined,
}

const empty_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: undefined,
  timeout: undefined,
}

test('runs static customiser', (t) => {
  const job = new Job('a')

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
  })
})

test('runs instance customiser', (t) => {
  const job = new Job('a', (a) => {
    a.interruptible = false
  })

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    interruptible: false,
  })
})

test('stores steps', (t) => {
  const job = new Job('a')

  job.add_step(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  job.add_step_first(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file-first'
      lv.load_var = 'my-var-first' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    plan: [
      {
        ...empty_step,
        load_var: 'my-var-first',
        file: 'my-file-first',
        format: undefined,
        reveal: undefined,
      },
      {
        ...empty_step,
        load_var: 'my-var',
        file: 'my-file',
        format: undefined,
        reveal: undefined,
      },
    ],
  })
})

test('stores old_name', (t) => {
  const job = new Job('a')

  job.set_old_name('my-old-name')

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    old_name: 'my-old-name',
  })
})

test('stores on_success', (t) => {
  const job = new Job('a')
  const ds = new DoStep('ds')

  job.add_on_success(ds)

  job.add_on_success(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    on_success: {
      ...empty_step,
      do: [
        {
          ...empty_step,
          load_var: 'my-var',
          file: 'my-file',
          format: undefined,
          reveal: undefined,
        },
      ],
    },
  })
})

test('stores on_error', (t) => {
  const job = new Job('a')
  const ds = new DoStep('ds')

  job.add_on_error(ds)

  job.add_on_error(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    on_error: {
      ...empty_step,
      do: [
        {
          ...empty_step,
          load_var: 'my-var',
          file: 'my-file',
          format: undefined,
          reveal: undefined,
        },
      ],
    },
  })
})

test('stores on_failure', (t) => {
  const job = new Job('a')
  const ds = new DoStep('ds')

  job.add_on_failure(ds)

  job.add_on_failure(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    on_failure: {
      ...empty_step,
      do: [
        {
          ...empty_step,
          load_var: 'my-var',
          file: 'my-file',
          format: undefined,
          reveal: undefined,
        },
      ],
    },
  })
})

test('stores on_abort', (t) => {
  const job = new Job('a')
  const ds = new DoStep('ds')

  job.add_on_abort(ds)

  job.add_on_abort(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    on_abort: {
      ...empty_step,
      do: [
        {
          ...empty_step,
          load_var: 'my-var',
          file: 'my-file',
          format: undefined,
          reveal: undefined,
        },
      ],
    },
  })
})

test('stores ensure', (t) => {
  const job = new Job('a')
  const ds = new DoStep('ds')

  job.add_ensure(ds)

  job.add_ensure(
    new LoadVarStep('lv', (lv) => {
      lv.file = 'my-file'
      lv.load_var = 'my-var' as Identifier
    })
  )

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    ensure: {
      ...empty_step,
      do: [
        {
          ...empty_step,
          load_var: 'my-var',
          file: 'my-file',
          format: undefined,
          reveal: undefined,
        },
      ],
    },
  })
})

test('stores serial_groups', (t) => {
  const job = new Job('a')

  job.add_serial_group('my-group')

  t.deepEqual(job.serialise(), {
    ...default_job,
    name: 'a',
    serial_groups: ['my-group'],
  })
})

test('collects resources', (t) => {
  const job = new Job('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  job.add_step(r.as_get_step())
  job.add_on_success(r.as_get_step())
  job.add_on_error(r.as_get_step())
  job.add_on_failure(r.as_get_step())
  job.add_on_abort(r.as_get_step())
  job.add_ensure(r.as_get_step())

  const result = job.get_resources()

  t.is(result.length, 6)
  t.deepEqual(deduplicate_by_identity(result), [r])
})

test('collects task steps', (t) => {
  const job = new Job('a')

  const ts = new Task('t', (t) => {
    t.platform = 'linux'
  }).as_task_step()

  job.add_step(ts)
  job.add_on_success(ts)
  job.add_on_error(ts)
  job.add_on_failure(ts)
  job.add_on_abort(ts)
  job.add_ensure(ts)

  const result = job.get_task_steps()

  t.is(result.length, 6)
  t.deepEqual(deduplicate_by_identity(result), [ts])
})
