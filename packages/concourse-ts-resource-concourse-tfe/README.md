<h1 align="center">
  concourse-ts-resource-concourse-tfe
</h1>

<div align="center">

  Typed ConcourseTfe resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-tfe`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-tfe`

## Usage

The ConcourseTfe resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseTfeResource, ConcourseTfeResourceType} from '@decentm/concourse-ts-resource-concourse-tfe'

export class CorpityCorpConcourseTfe extends ConcourseTfeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseTfe>) {
    super(name, new ConcourseTfeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
