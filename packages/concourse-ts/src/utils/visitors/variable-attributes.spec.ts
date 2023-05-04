import test from 'ava'

import {visit_variable_attributes} from './variable-attributes'
import {Identifier} from '../identifier'
import {Pipeline, Step, Task, TaskStep} from '../../declarations'

const call_count = test.macro<[Step | Pipeline, number]>(
  (t, input, expected_call_count) => {
    let actual_call_count = 0

    visit_variable_attributes(input, {
      Attribute() {
        actual_call_count++
      },
    })

    t.is(actual_call_count, expected_call_count)
  }
)

test(
  'visits TaskStep.task',
  call_count,
  {
    task: 'my-task' as Identifier,
  },
  1
)

test(
  'visits TaskStep.params',
  call_count,
  {
    task: 'my-task' as Identifier,
    params: {
      param1: 'value1',
      param2: 'value2',
    },
  },
  3
)

test(
  'visits TaskStep.file',
  call_count,
  {
    task: 'my-task' as Identifier,
    file: 'my-file',
  },
  2
)

test(
  'visits TaskStep.config.caches',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      caches: [
        {
          path: 'my-cache-path',
        },
      ],
    },
  } as TaskStep,
  2
)

test(
  'visits TaskStep.config.image_resource.type',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      image_resource: {
        type: 'registry-image',
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  2
)

test(
  'visits TaskStep.config.image_resource.source',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      image_resource: {
        source: {
          my_source: 'my-value',
          my_source2: 2,
        },
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  // 2, because we shouldn't try to interpolate numbers
  2
)

test(
  'visits TaskStep.config.image_resource.params',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      image_resource: {
        params: {
          my_param: 'my-value',
          my_param2: 4,
        },
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  // 2, because we shouldn't try to interpolate numbers
  2
)

test(
  'visits TaskStep.config.image_resource.version - object',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      image_resource: {
        version: {
          my_version: 'my-value',
        },
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  2
)

test(
  'visits TaskStep.config.image_resource.version - string',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      image_resource: {
        version: 'all',
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  2
)

test(
  'visits TaskStep.config.inputs',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      inputs: [
        {
          name: 'my-input' as Identifier,
          path: 'my-path',
        },
        {
          name: 'my-input1' as Identifier,
        },
      ],
    },
  } as TaskStep,
  4
)

test(
  'visits TaskStep.config.outputs',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      outputs: [
        {
          name: 'my-output' as Identifier,
          path: 'my-path',
        },
        {
          name: 'my-output1' as Identifier,
        },
      ],
    },
  } as TaskStep,
  4
)

test(
  'visits TaskStep.config.params',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      params: {
        my_param: 'my-value',
      },
    } as unknown as Task<Identifier, Identifier>,
  },
  2
)

test(
  'visits TaskStep.config.run',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      run: {
        path: '/my/path',
        args: ['arg-1', 'arg-2'],
        dir: '.',
        user: 'root',
      },
    },
  } as TaskStep,
  6
)

test(
  'visits string attributes in TaskStep.config',
  call_count,
  {
    task: 'my-task' as Identifier,
    config: {
      platform: 'linux',
      rootfs_uri: undefined,
    },
  } as TaskStep,
  2
)

test(
  'recursively traverses into do steps',
  call_count,
  {
    do: [
      {
        task: 'my-task' as Identifier,
      },
    ],
  },
  1
)

test(
  'recursively traverses into in_parallel steps - array',
  call_count,
  {
    in_parallel: [
      {
        task: 'my-task' as Identifier,
      },
    ],
  },
  1
)

test(
  'recursively traverses into in_parallel steps - object',
  call_count,
  {
    in_parallel: {
      steps: [
        {
          task: 'my-task' as Identifier,
        },
      ],
    },
  },
  1
)

test(
  'recursively traverses into ensure steps',
  call_count,
  {
    do: [],
    ensure: {
      task: 'my-task' as Identifier,
    },
  },
  1
)

test(
  'recursively traverses into on_success steps',
  call_count,
  {
    do: [],
    on_success: {
      task: 'my-task' as Identifier,
    },
  },
  1
)

test(
  'recursively traverses into on_abort steps',
  call_count,
  {
    do: [],
    on_abort: {
      task: 'my-task' as Identifier,
    },
  },
  1
)

test(
  'recursively traverses into on_failure steps',
  call_count,
  {
    do: [],
    on_failure: {
      task: 'my-task' as Identifier,
    },
  },
  1
)

test(
  'recursively traverses into on_error steps',
  call_count,
  {
    do: [],
    on_error: {
      task: 'my-task' as Identifier,
    },
  },
  1
)

test(
  'visits Pipeline.resource.source',
  call_count,
  {
    jobs: [],
    resources: [
      {
        source: {
          my_source: 'my-value',
          number_source: 4,
        },
      },
    ],
  } as unknown as Pipeline,
  1
)

test(
  'visits Pipeline.resource.webhook_token',
  call_count,
  {
    jobs: [],
    resources: [
      {
        webhook_token: 'my-token',
      },
    ],
  } as unknown as Pipeline,
  1
)

test(
  'recurses into jobs when given a Pipeline',
  call_count,
  {
    jobs: [
      {
        name: 'my-job' as Identifier,
        plan: [
          {
            task: 'my-task' as Identifier,
          },
        ],
      },
    ],
  },
  1
)
