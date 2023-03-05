import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

export type Source = {
  /**
   * For use on `task.image_resource`, returns itself as an image that tasks can run on.
   */
  mirror_self?: boolean
  /**
   * Initial version that the resource should emit. Defaults to `mock`.
   */
  initial_version?: string
  /**
   * Disable initial version, useful for testing resource triggers.
   */
  no_initial_version?: boolean
  /**
   * Always emit a version regardless of any param during `check`.
   */
  force_version?: boolean
  /**
   * Example:
   * ```yaml
   * create_files:
   *   file1.yml: |
   *     foo: bar
   *   file2.sh |
   *     #!/bin/sh
   *     echo "hello world"
   * ```
   */
  create_files?: Record<string, string>
  /**
   * Amount of time to sleep before returning from the `check`. Uses Go duration
   * format.
   */
  check_delay?: ConcourseTs.Utils.Duration
  /**
   * Force every check to return this error message.
   */
  check_failure?: string
  /**
   * List of name-value pairs to return as metadata on every get and put. Example:
   * ```yaml
   * metadata:
   * - name: foo
   *   value: bar
   * - name: baz
   *   value: qux
   * ```
   */
  metadata?: Array<{ name: string; value: string }>
}

export type PutParams = {
  /**
   * Version to create.
   */
  version?: string
  /**
   * Print all environment variables to stdout when set to true. Default false.
   */
  print_env?: boolean
  /**
   * Contents will be read from the file and emitted as the version
   */
  file?: string
}

export type GetParams = {
  /**
   * Same as configuring `mirror_self` in source when set to true. Default false.
   */
  mirror_self_via_params?: boolean
  /**
   * Similar to `create_files` in source; merged in so that additional (or replaced) files can be specified.
   */
  create_files_via_params?: Record<string, string>
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image' & ConcourseTs.Utils.Identifier,
  RegistryImage.Source<'concourse/mock-resource'>
>
