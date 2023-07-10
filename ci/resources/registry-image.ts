import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

const registry_type: RegistryImage.ResourceType = new ConcourseTs.ResourceType(
  'custom-registry-image',
  (rt) => {
    rt.set_type('registry-image')

    rt.source = {
      repository: 'concourse/registry-image-resource',
      tag: '1.8-alpine',
    }
  }
)

export type CreateRegistryImageResourceInput = {
  repository: string
  tag?: string
}

const create_registry_image_resource = (
  input: CreateRegistryImageResourceInput
): RegistryImage.Resource =>
  new ConcourseTs.Resource('docker-hub', registry_type, (r) => {
    r.icon = 'docker'

    r.source = {
      repository: input.repository,
      tag: input.tag,
      username: ConcourseTs.Utils.get_var('docker-hub.username'),
      password: ConcourseTs.Utils.get_var('docker-hub.token'),
    }

    r.customise_put_step((ps) => {
      ps.set_get_param({ key: 'skip_download', value: true })
    })
  })

export const cli_registry_image = create_registry_image_resource({
  repository: 'decentm/concourse-ts-cli',
})
