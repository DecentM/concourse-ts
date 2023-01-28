<h1 align="center">
  concourse-ts-resource-docker-image
</h1>

<div align="center">

  Typed DockerImage resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-docker-image`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-docker-image`

## Usage

The DockerImage resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {DockerImageResource, DockerImageResourceType} from '@decentm/concourse-ts-resource-docker-image'

export class CorpityCorpDockerImage extends DockerImageResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpDockerImage>) {
    super(name, new DockerImageResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
