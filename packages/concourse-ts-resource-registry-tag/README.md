<h1 align="center">
  concourse-ts-resource-registry-tag
</h1>

<div align="center">

  Typed RegistryTag resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-registry-tag`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-registry-tag`

## Usage

The RegistryTag resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RegistryTagResource, RegistryTagResourceType} from '@decentm/concourse-ts-resource-registry-tag'

export class CorpityCorpRegistryTag extends RegistryTagResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRegistryTag>) {
    super(name, new RegistryTagResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
