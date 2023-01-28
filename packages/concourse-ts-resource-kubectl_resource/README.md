<h1 align="center">
  concourse-ts-resource-kubectl_resource
</h1>

<div align="center">

  Typed Kubectl_resource resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-kubectl_resource`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-kubectl_resource`

## Usage

The Kubectl_resource resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {Kubectl_resourceResource, Kubectl_resourceResourceType} from '@decentm/concourse-ts-resource-kubectl_resource'

export class CorpityCorpKubectl_resource extends Kubectl_resourceResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpKubectl_resource>) {
    super(name, new Kubectl_resourceResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
