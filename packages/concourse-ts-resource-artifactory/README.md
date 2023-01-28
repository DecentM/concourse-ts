<h1 align="center">
  concourse-ts-resource-artifactory
</h1>

<div align="center">

  Typed Artifactory resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory`

## Usage

The Artifactory resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ArtifactoryResource, ArtifactoryResourceType} from '@decentm/concourse-ts-resource-artifactory'

export class CorpityCorpArtifactory extends ArtifactoryResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpArtifactory>) {
    super(name, new ArtifactoryResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
