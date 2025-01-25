import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

export type Source = {
  /**
   *  Package name.
   */
  package: string
  /**
   * Use `scope-name` as scope value instead of using `@scope-name/package-name`
   * as package name.
   */
  scope?: string
  registry?: {
    /**
     * Registry containing the package, either a public mirror or a private
     * registry. Defaults to `https://registry.npmjs.org/`.
     */
    uri: string
    /**
     * Access credentials for the registry, use `npm login` on your machine and
     * look for the `_authToken` value in your `~/.npmrc`.
     */
    token?: string
  }
  /**
   * Array of additional registry entries to add to the `~/.npmrc` file.
   */
  additional_registries?: Array<{
    /**
     * Additional registry uri. May be useful during a `get` step to allow npm
     * to validate package dependencies.
     */
    uri: string
    /**
     * Scope for the additional registry. Defaults to '' for (no scope).
     */
    scope?: string
  }>
}

export type PutParams = {
  /**
   * Path to the directory containing the `package.json` file.
   */
  path: string
  /**
   * Path to a file containing the version, overrides the version stored in
   * `package.json`.
   */
  version?: string
  /**
   * Boolean to publish npm package with args `--access public`. Default=false.
   */
  public?: boolean
}

export type GetParams = {
  /**
   * Do not download the package including dependencies, just save the version
   * file.
   */
  skip_download?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams, 'registry-image', RegistryImage.Source<'timotto/concourse-npm-resource'>>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'timotto/concourse-npm-resource'>
>
