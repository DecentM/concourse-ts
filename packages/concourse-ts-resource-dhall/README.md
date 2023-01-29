<h1 align="center">
  concourse-ts-resource-dhall
</h1>

<div align="center">

  Typed Dhall resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-dhall`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-dhall`

## Usage

The Dhall resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {DhallResource, DhallResourceType} from '@decentm/concourse-ts-resource-dhall'

export class CorpityCorpDhall extends DhallResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpDhall>) {
    super(name, new DhallResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
