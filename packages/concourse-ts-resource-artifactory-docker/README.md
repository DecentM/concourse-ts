<h1 align="center">
  concourse-ts-resource-artifactory-docker
</h1>

<div align="center">

  Typed ArtifactoryDocker resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory-docker`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory-docker`

## Usage

The ArtifactoryDocker resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ArtifactoryDockerResource, ArtifactoryDockerResourceType} from '@decentm/concourse-ts-resource-artifactory-docker'

export class CorpityCorpArtifactoryDocker extends ArtifactoryDockerResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpArtifactoryDocker>) {
    super(name, new ArtifactoryDockerResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
