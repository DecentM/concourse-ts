<h1 align="center">
  concourse-ts-resource-fossil
</h1>

<div align="center">

  Typed Fossil resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-fossil`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-fossil`

## Usage

The Fossil resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {FossilResource, FossilResourceType} from '@decentm/concourse-ts-resource-fossil'

export class CorpityCorpFossil extends FossilResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpFossil>) {
    super(name, new FossilResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
