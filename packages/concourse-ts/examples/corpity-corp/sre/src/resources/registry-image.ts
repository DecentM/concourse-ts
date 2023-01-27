import {Presets} from '../../../../../src'

export type DockerImageInput = {
  name: string
  repository: string
  target?: string
  tag?: string
  cache?: boolean
  implicit_get?: boolean
  dockerfile?: string
}

export class PrivateQuayImage extends Presets.Resource.RegistryImage {
  constructor(name: string, input: DockerImageInput) {
    super(name, {
      repository: `quay.io/${input.repository}`,
      tag: input.tag ?? 'latest',
    })

    this.set_check_every({minutes: 5})

    this.icon = 'ferry'
  }
}
