import * as ConcourseTs from '@decentm/concourse-ts'

export const NODE_VERSION = '22.13.1'

export const Secret = {
  npm_automation_token: ConcourseTs.Utils.get_var('npm.automation-token'),
} as const
