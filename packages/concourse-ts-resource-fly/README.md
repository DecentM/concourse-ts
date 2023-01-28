<h1 align="center">
  concourse-ts-resource-fly
</h1>

<div align="center">

  Typed Fly resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-fly`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-fly`

## Usage

The Fly resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {FlyResource, FlyResourceType} from '@decentm/concourse-ts-resource-fly'

export class CorpityCorpFly extends FlyResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpFly>) {
    super(name, new FlyResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
