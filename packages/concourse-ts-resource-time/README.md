<h1 align="center">
  concourse-ts-resource-time
</h1>

<div align="center">

  Typed Time resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-time`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-time`

## Usage

The Time resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {TimeResource, TimeResourceType} from '@decentm/concourse-ts-resource-time'

export class CorpityCorpTime extends TimeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpTime>) {
    super(name, new TimeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
