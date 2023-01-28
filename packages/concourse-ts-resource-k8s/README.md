<h1 align="center">
  concourse-ts-resource-k8s
</h1>

<div align="center">

  Typed K8s resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-k8s`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-k8s`

## Usage

The K8s resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {K8sResource, K8sResourceType} from '@decentm/concourse-ts-resource-k8s'

export class CorpityCorpK8s extends K8sResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpK8s>) {
    super(name, new K8sResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
