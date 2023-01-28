<h1 align="center">
  concourse-ts-resource-datadog-event
</h1>

<div align="center">

  Typed DatadogEvent resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-datadog-event`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-datadog-event`

## Usage

The DatadogEvent resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {DatadogEventResource, DatadogEventResourceType} from '@decentm/concourse-ts-resource-datadog-event'

export class CorpityCorpDatadogEvent extends DatadogEventResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpDatadogEvent>) {
    super(name, new DatadogEventResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
