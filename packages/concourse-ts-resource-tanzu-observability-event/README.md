<h1 align="center">
  concourse-ts-resource-tanzu-observability-event
</h1>

<div align="center">

  Typed TanzuObservabilityEvent resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-tanzu-observability-event`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-tanzu-observability-event`

## Usage

The TanzuObservabilityEvent resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {TanzuObservabilityEventResource, TanzuObservabilityEventResourceType} from '@decentm/concourse-ts-resource-tanzu-observability-event'

export class CorpityCorpTanzuObservabilityEvent extends TanzuObservabilityEventResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpTanzuObservabilityEvent>) {
    super(name, new TanzuObservabilityEventResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
