import {BuildLogRetentionPolicy} from '../../declarations/types'

export const LogRetentionPolicyTenBuilds: BuildLogRetentionPolicy = {
  builds: 10,
  minimum_succeeded_builds: 7,
}
