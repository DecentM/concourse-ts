<h1 align="center">
  concourse-ts-resource-#template#
</h1>

<div align="center">

  Typed #Template# resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-#template#`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-#template#`

## Usage

The #Template# resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {#Template#Resource, #Template#ResourceType} from '@decentm/concourse-ts-resource-#template#'

export class CorpityCorp#Template# extends #Template#Resource {
  constructor(name: string, init?: Type.Initer<CorpityCorp#Template#>) {
    super(name, new #Template#ResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
