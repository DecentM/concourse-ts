import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

type SourceNoAuth = {
  /**
   * The login or authentication token of a SonarQube user with Execute Analysis
   * permission. Can be left out if SonarQube instance does not require any
   * authentication.
   */
  login?: undefined
  /**
   * The password that goes with the sonar.login username. This should be left
   * blank if an authentication token is being used.
   */
  password?: undefined
}

type SourceTokenAuth = {
  /**
   * The login or authentication token of a SonarQube user with Execute Analysis
   * permission. Can be left out if SonarQube instance does not require any
   * authentication.
   */
  login: ConcourseTs.Utils.Var
  /**
   * The password that goes with the sonar.login username. This should be left
   * blank if an authentication token is being used.
   */
  password?: undefined
}

type SourceUsernamePasswordAuth = {
  /**
   * The login or authentication token of a SonarQube user with Execute Analysis
   * permission. Can be left out if SonarQube instance does not require any
   * authentication.
   */
  login: ConcourseTs.Utils.Var | string
  /**
   * The password that goes with the sonar.login username. This should be left
   * blank if an authentication token is being used.
   */
  password: ConcourseTs.Utils.Var
}

type SourceBase = SourceNoAuth | SourceTokenAuth | SourceUsernamePasswordAuth

/**
 * https://github.com/cathive/concourse-sonarqube-resource
 */
export type Source = SourceBase & {
  /**
   * The address of the SonarQube instance, e.g. "https://sonarcloud.io/" (when
   * using SonarCloud). Must end with a slash.
   */
  host_url: string
  /**
   * The organization to be used when submitting stuff to a sonarqube instance.
   * This field is required when using SonarCloud to perform the analysis of
   * your code.
   */
  organization?: string
  /**
   *  Maven settings to be used when performing SonarQube analysis. Only used if
   *  the scanner_type during the out phase has been set to / determined to use
   *  Maven.
   */
  maven_settings?: string
  /**
   * This flag is used to debug any problems that might occur when using the
   * resource itself. It enables extra debug output on the console and sets the
   * -x flag during shell execution. It is usually not a good idea to set this
   * flag to true in a production environment, because it might leak passwords
   * and access key credentials to the console where it might be accessed by
   * unauthorized / anonymous users.
   */
  __debug?: boolean
}

export type PutParams = {
  /**
   * Path to the resource that shall be analyzed. If the path contains a file called "sonar-project.properties" it will be picked up during analysis.
   */
  project_path: string
  /**
   * Type of scanner to be used. Possible values are:
      - `auto` (default) - Uses the maven-Scanner if a pom.xml is found in the directory specified
        by sources, cli otherwise.

      - `cli` - Forces usage of the command line scanner, even if a Maven project object
        model (pom.xml) is found in the sources directory.

      - `maven` - Forces usage of the Maven plugin to perform the scan.
   */
  scanner_type?: 'auto' | 'cli' | 'maven'
  /**
   * (default value is read from sonar-project.properties)
   */
  project_key?: string
  /**
   * File to be used to read the Project key. When this option has been
   * specified, it has precedence over the project_key parameter.
   */
  project_key_file?: string
  /**
   * (default value is read from sonar-project.properties)
   */
  project_name?: string
  /**
   * (default value is read from sonar-project.properties)
   */
  project_description?: string
  /**
   * (default value is read from sonar-project.properties)
   */
  project_version?: string
  /**
   * File to be used to read the Project version. When this option has been
   * specified, it has precedence over the project_version parameter.
   */
  project_version_file?: string
  /**
   * Try to figure out the branch automatically. This works if the project_path
   * contains recognized SCM metadata from a supported revision control system.
   * (Currently: only Git is supported!)
   */
  autodetect_branch_name?: string
  /**
   * Name of the branch. Overrides autodetect_branch_name if it has been set.
   */
  branch_name?: string
  /**
   * File to be used to read the branch name. When this option has been
   * specified, it has precedence over the branch_name parameter.
   */
  branch_name_file?: string
  /**
   * Name of the branch where you intend to merge your short-lived branch at the
   * end of its life. If left blank, this defaults to the master branch. It can
   * also be used while initializing a long-lived branch to sync the issues from
   * a branch other than the Main Branch. (See Branch Plugin documentation for
   * further details)
   */
  branch_target?: string
  /**
   * File to be used to read the branch target. When this option has been
   * specified, it has precedence over the branch_target parameter.
   */
  branch_target_file?: string
  /**
   * If set to true it will try to fetch the pull request id, the head branch
   * name and the base branch name from the pull request resource. It will
   * enable sonar.pullrequest.key, sonar.pullrequest.branch and
   * sonar.pullrequest.base flags when performing your analysis.
   *
   * It works for:
   *  - telia-oss/github-pr-resource
   *  - zarplata/concourse-git-bitbucket-pr-resource
   *  - jtarchie/github-pullrequest-resource
   *
   *  In order to use this feature you must be using SonarCloud or SonarQube
   *  Developer edition.
   */
  decorate_pr?: boolean
  /**
   *  A list of paths to directories containing source files.
   */
  sources?: string[]
  /**
   * A list of paths to directories containing source files.
   */
  tests?: string[]
  /**
   * Optional values to be passed in to the $SONAR_SCANNER_OPTS env variable.
   * Can be used to provide parameters to Sonar before the scanner process
   * starts. This is at the moment essentially necessary for HTTP proxy
   * settings.
   */
  additional_sonar_scanner_opts?: string
  /**
   * Optional object/dictionary that may contain any additional properties that
   * one might want to pass when running the sonar-scanner.
   */
  additional_properties?: Record<string, ConcourseTs.Type.YamlValue>
  /**
   * Optional path to a file containing properties that should be passed to the
   * sonar-scanner.
   */
  additional_properties_file?: string
  /**
   * Path to a Maven settings file that shall be used. Only used if the
   * scanner_type during has been set to / determined to use Maven. If the
   * resource itself has a maven_settings configuration, this key will override
   * its value.
   */
  maven_settings_file?: string
  /**
   * (default is empty and using the latest version)
   */
  sonar_maven_plugin_version?: string
}

export type GetParams = {
  quality_gate?: {
    /**
     * Ignore all WARN metrics and let the get step succeed
     */
    ignore_all_warn?: boolean
    /**
     *  Ignore all ERROR metrics and let the get step succeed
     */
    ignore_all_error?: boolean
    /**
     * A list of metric keys to ignore when their quality gate result is WARN
     *
     * Example: `['new_duplicated_lines_density', 'violations']`
     */
    ignore_warns?: string[]
    /**
     * A list of metric keys to ignore when their quality gate result is ERROR
     *
     * Example: `['new_coverage', 'violations']`
     */
    ignore_errors?: string[]
  }
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'cathive/concourse-sonarqube-resource'>
>
