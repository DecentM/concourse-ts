import * as ConcourseTs from '@decentm/concourse-ts'

export const NODE_VERSION = '20.16.0'

export const Secret = {
  npm_automation_token: ConcourseTs.Utils.get_var('npm.automation-token'),
} as const
