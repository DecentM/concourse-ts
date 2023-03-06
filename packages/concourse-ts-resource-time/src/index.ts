import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/concourse/time-resource
 */
export type Source = {
  /**
   * The interval on which to report new versions. Valid examples: 60s, 90m, 1h.
   * If not specified, this resource will generate exactly 1 new version per
   * calendar day on each of the valid days.
   */
  interval?: string
  /**
   * Default UTC. The location in which to interpret start, stop, and days.
   *
   * Example: Africa/Abidjan
   */
  location?: string
  /**
   * Limit the creation of new versions to times on/after start and before stop.
   * The supported formats for the times are: 3:04 PM, 3PM, 3PM, 15:04, and
   * 1504. If a start is specified, a stop must also be specified, and vice
   * versa. If neither value is specified, both values will default to 00:00 and
   * this resource can generate a new version (based on interval) at any time of
   * day.
   *
   * Example: 8:00 AM
   */
  start?: string
  /**
   * Limit the creation of new versions to times on/after start and before stop.
   * The supported formats for the times are: 3:04 PM, 3PM, 3PM, 15:04, and
   * 1504. If a start is specified, a stop must also be specified, and vice
   * versa. If neither value is specified, both values will default to 00:00 and
   * this resource can generate a new version (based on interval) at any time of
   * day.
   *
   * Example: 8:00 PM
   */
  stop?: string
  /**
   * Limit the creation of new time versions to the specified day(s).
   */
  days?: Array<
    | 'Sunday'
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
  >
  /**
   * When using `start` and `stop` as a trigger for a job, you will be unable to
   * run the job manually until it goes into the configured time range for the
   * first time (manual runs will work once the `time` resource has produced
   * it's first version).
   *
   * To get around this issue, there are two approaches:
   * * Use `initial_version: true`, which will produce a new version that is set
   *   to the current time, if `check` runs and there isn't already a version
   *   specified. **NOTE: This has a downside that if used with `trigger: true`,
   *   it will kick off the correlating job when the pipeline is first created,
   *   even outside of the specified window**.
   * * Alternatively, once you push a pipeline that utilizes `start` and `stop`,
   *   run the following fly command to run the resource check from a previous
   *   point in time (see [this
   *   issue](https://github.com/concourse/time-resource/issues/24#issuecomment-689422764)
   *   for 6.x.x+ or [this
   *   issue](https://github.com/concourse/time-resource/issues/11#issuecomment-562385742)
   *   for older Concourse versions).
   *
   * ```
   * fly -t <your target> \
   *    check-resource --resource <pipeline>/<your resource>
   *    --from "time:2000-01-01T00:00:00Z" # the important part
   * ```
   *
   * This has the benefit that it shouldn't trigger that initial job run, but
   * will still allow you to manually run the job if needed.
   */
  initial_version?: boolean
}

export type PutParams = Record<string, never>

export type GetParams = Record<string, never>

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'concourse/time-resource'>
>
