<h1 align="center">
  concourse-ts-resource-gcs
</h1>

<div align="center">

  Typed Gcs resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-gcs`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-gcs`

## Usage

The Gcs resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GcsResource, GcsResourceType} from '@decentm/concourse-ts-resource-gcs'

export class CorpityCorpGcs extends GcsResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGcs>) {
    super(name, new GcsResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
