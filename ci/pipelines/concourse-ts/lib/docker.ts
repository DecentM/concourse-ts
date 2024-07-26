import * as ConcourseTs from '@decentm/concourse-ts'
import {
  create_oci_build,
  OciBuildTaskInput,
} from '@decentm/concourse-ts-recipe-oci-build'

import { git } from 'ci/resources/git'
import { NODE_VERSION } from 'ci/consts'

export const docker = (
  target: string,
  extra_options?: OciBuildTaskInput['options'],
  customise?: (
    instance: ConcourseTs.Task<
      ConcourseTs.Utils.Identifier,
      ConcourseTs.Utils.Identifier
    >
  ) => void
) => {
  const oci_build = create_oci_build({
    resource: git,
    options: {
      ...(extra_options ?? {}),
      target,
      build_args: {
        ...(extra_options?.build_args ?? {}),
        NODE_ENV: 'production',
        NODE_VERSION: NODE_VERSION,
      },
    },
  })

  return oci_build(customise)
}
