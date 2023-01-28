<h1 align="center">
  concourse-ts-resource-vasu-k8s
</h1>

<div align="center">

  Typed VasuK8s resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-vasu-k8s`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-vasu-k8s`

## Usage

The VasuK8s resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {VasuK8sResource, VasuK8sResourceType} from '@decentm/concourse-ts-resource-vasu-k8s'

export class CorpityCorpVasuK8s extends VasuK8sResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpVasuK8s>) {
    super(name, new VasuK8sResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
