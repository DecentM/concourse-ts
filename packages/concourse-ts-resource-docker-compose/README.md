<h1 align="center">
  concourse-ts-resource-docker-compose
</h1>

<div align="center">

  Typed DockerCompose resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-docker-compose`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-docker-compose`

## Usage

The DockerCompose resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {DockerComposeResource, DockerComposeResourceType} from '@decentm/concourse-ts-resource-docker-compose'

export class CorpityCorpDockerCompose extends DockerComposeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpDockerCompose>) {
    super(name, new DockerComposeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
