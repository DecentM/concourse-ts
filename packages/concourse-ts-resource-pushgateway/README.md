<h1 align="center">
  concourse-ts-resource-pushgateway
</h1>

<div align="center">

  Typed Pushgateway resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-pushgateway`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-pushgateway`

## Usage

The Pushgateway resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {PushgatewayResource, PushgatewayResourceType} from '@decentm/concourse-ts-resource-pushgateway'

export class CorpityCorpPushgateway extends PushgatewayResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpPushgateway>) {
    super(name, new PushgatewayResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
