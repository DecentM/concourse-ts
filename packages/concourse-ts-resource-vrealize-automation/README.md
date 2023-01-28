<h1 align="center">
  concourse-ts-resource-vrealize-automation
</h1>

<div align="center">

  Typed VrealizeAutomation resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-vrealize-automation`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-vrealize-automation`

## Usage

The VrealizeAutomation resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {VrealizeAutomationResource, VrealizeAutomationResourceType} from '@decentm/concourse-ts-resource-vrealize-automation'

export class CorpityCorpVrealizeAutomation extends VrealizeAutomationResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpVrealizeAutomation>) {
    super(name, new VrealizeAutomationResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
