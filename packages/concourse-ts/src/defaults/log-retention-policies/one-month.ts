import {BuildLogRetentionPolicy} from '../../declarations/types'

export const LogRetentionPolicyOneMonth: BuildLogRetentionPolicy = {
  days: 30,
  minimum_succeeded_builds: 7,
}
