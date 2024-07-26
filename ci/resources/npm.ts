import * as ConcourseTs from '@decentm/concourse-ts'
import * as Npm from '@decentm/concourse-ts-resource-npm'

const npm_type: Npm.ResourceType = new ConcourseTs.ResourceType('git', (rt) => {
  rt.set_type('registry-image')

  rt.source = {
    repository: 'timotto/concourse-npm-resource',
    tag: 'fbd2113',
  }
})

export type NpmInput = {
  package: string
}

export const create_npm_resource = (input: NpmInput): Npm.Resource =>
  new ConcourseTs.Resource(input.package, npm_type, (r) => {
    r.source = {
      package: input.package,
      scope: 'decentm',
      registry: {
        uri: 'https://registry.npmjs.org',
      },
    }

    r.icon = 'npm'
  })
