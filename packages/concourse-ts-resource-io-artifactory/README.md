<h1 align="center">
  concourse-ts-resource-io-artifactory
</h1>

<div align="center">

  Typed IoArtifactory resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-io-artifactory`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-io-artifactory`

## Usage

The IoArtifactory resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {IoArtifactoryResource, IoArtifactoryResourceType} from '@decentm/concourse-ts-resource-io-artifactory'

export class CorpityCorpIoArtifactory extends IoArtifactoryResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpIoArtifactory>) {
    super(name, new IoArtifactoryResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
