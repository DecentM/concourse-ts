<h1 align="center">
  concourse-ts-resource-registry-image
</h1>

<div align="center">

  Typed RegistryImage resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-registry-image`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-registry-image`

## Usage

The RegistryImage resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RegistryImageResource, RegistryImageResourceType} from '@decentm/concourse-ts-resource-registry-image'

export class CorpityCorpRegistryImage extends RegistryImageResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRegistryImage>) {
    super(name, new RegistryImageResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
