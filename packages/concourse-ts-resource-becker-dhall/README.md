<h1 align="center">
  concourse-ts-resource-becker-dhall
</h1>

<div align="center">

  Typed BeckerDhall resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-becker-dhall`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-becker-dhall`

## Usage

The BeckerDhall resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BeckerDhallResource, BeckerDhallResourceType} from '@decentm/concourse-ts-resource-becker-dhall'

export class CorpityCorpBeckerDhall extends BeckerDhallResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBeckerDhall>) {
    super(name, new BeckerDhallResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
