<h1 align="center">
  concourse-ts-resource-key-value
</h1>

<div align="center">

  Typed KeyValue resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-key-value`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-key-value`

## Usage

The KeyValue resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {KeyValueResource, KeyValueResourceType} from '@decentm/concourse-ts-resource-key-value'

export class CorpityCorpKeyValue extends KeyValueResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpKeyValue>) {
    super(name, new KeyValueResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
