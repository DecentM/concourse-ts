<h1 align="center">
  concourse-ts-resource-coralogix-event
</h1>

<div align="center">

  Typed CoralogixEvent resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-coralogix-event`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-coralogix-event`

## Usage

The CoralogixEvent resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {CoralogixEventResource, CoralogixEventResourceType} from '@decentm/concourse-ts-resource-coralogix-event'

export class CorpityCorpCoralogixEvent extends CoralogixEventResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpCoralogixEvent>) {
    super(name, new CoralogixEventResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
