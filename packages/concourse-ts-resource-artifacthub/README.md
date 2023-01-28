<h1 align="center">
  concourse-ts-resource-artifacthub
</h1>

<div align="center">

  Typed Artifacthub resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-artifacthub`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-artifacthub`

## Usage

The Artifacthub resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ArtifacthubResource, ArtifacthubResourceType} from '@decentm/concourse-ts-resource-artifacthub'

export class CorpityCorpArtifacthub extends ArtifacthubResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpArtifacthub>) {
    super(name, new ArtifacthubResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
