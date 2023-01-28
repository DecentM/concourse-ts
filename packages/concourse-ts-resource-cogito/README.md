<h1 align="center">
  concourse-ts-resource-cogito
</h1>

<div align="center">

  Typed Cogito resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-cogito`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-cogito`

## Usage

The Cogito resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CogitoResource, CogitoResourceType} from '@decentm/concourse-ts-resource-cogito'

export class CorpityCorpCogito extends CogitoResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCogito>) {
    super(name, new CogitoResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
