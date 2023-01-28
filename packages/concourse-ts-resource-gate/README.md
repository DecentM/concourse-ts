<h1 align="center">
  concourse-ts-resource-gate
</h1>

<div align="center">

  Typed Gate resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-gate`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-gate`

## Usage

The Gate resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GateResource, GateResourceType} from '@decentm/concourse-ts-resource-gate'

export class CorpityCorpGate extends GateResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGate>) {
    super(name, new GateResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
