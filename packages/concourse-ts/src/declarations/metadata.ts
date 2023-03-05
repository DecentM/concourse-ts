/**
 * https://concourse-ci.org/implementing-resource-types.html#resource-metadata
 */
export const BuildMetadata = {
  BuildId: '$BUILD_ID',
  BuildName: '$BUILD_NAME',
  BuildJobName: '$BUILD_JOB_NAME',
  BuildPipelineName: '$BUILD_PIPELINE_NAME',
  BuildPipelineInstanceVars: '$BUILD_PIPELINE_INSTANCE_VARS',
  BuildTeamName: '$BUILD_TEAM_NAME',
  BuildCreatedBy: '$BUILD_CREATED_BY',
  AtcExternalUrl: '$ATC_EXTERNAL_URL',
} as const

/**
 * https://concourse-ci.org/implementing-resource-types.html#resource-metadata
 */
export type BuildMetadata = (typeof BuildMetadata)[keyof typeof BuildMetadata]
