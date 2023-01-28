<h1 align="center">
  concourse-ts-resource-artifactory-deb
</h1>

<div align="center">

  Typed ArtifactoryDeb resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory-deb`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-artifactory-deb`

## Usage

The ArtifactoryDeb resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ArtifactoryDebResource, ArtifactoryDebResourceType} from '@decentm/concourse-ts-resource-artifactory-deb'

export class CorpityCorpArtifactoryDeb extends ArtifactoryDebResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpArtifactoryDeb>) {
    super(name, new ArtifactoryDebResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
