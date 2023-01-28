<h1 align="center">
  concourse-ts-resource-pool
</h1>

<div align="center">

  Typed Pool resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-pool`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-pool`

## Usage

The Pool resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {PoolResource, PoolResourceType} from '@decentm/concourse-ts-resource-pool'

export class CorpityCorpPool extends PoolResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpPool>) {
    super(name, new PoolResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
