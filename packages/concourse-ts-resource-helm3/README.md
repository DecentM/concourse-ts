<h1 align="center">
  concourse-ts-resource-helm3
</h1>

<div align="center">

  Typed Helm3 resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-helm3`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-helm3`

## Usage

The Helm3 resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {Helm3Resource, Helm3ResourceType} from '@decentm/concourse-ts-resource-helm3'

export class CorpityCorpHelm3 extends Helm3Resource {
  constructor(name: string, init?: Type.Initer<CorpityCorpHelm3>) {
    super(name, new Helm3ResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
