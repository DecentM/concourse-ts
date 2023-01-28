<h1 align="center">
  concourse-ts-resource-cf
</h1>

<div align="center">

  Typed Cf resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-cf`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-cf`

## Usage

The Cf resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CfResource, CfResourceType} from '@decentm/concourse-ts-resource-cf'

export class CorpityCorpCf extends CfResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCf>) {
    super(name, new CfResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
