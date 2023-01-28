<h1 align="center">
  concourse-ts-resource-awx
</h1>

<div align="center">

  Typed Awx resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-awx`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-awx`

## Usage

The Awx resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {AwxResource, AwxResourceType} from '@decentm/concourse-ts-resource-awx'

export class CorpityCorpAwx extends AwxResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpAwx>) {
    super(name, new AwxResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
