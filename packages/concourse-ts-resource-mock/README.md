<h1 align="center">
  concourse-ts-resource-mock
</h1>

<div align="center">

  Typed Mock resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-mock`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-mock`

## Usage

The Mock resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {MockResource, MockResourceType} from '@decentm/concourse-ts-resource-mock'

export class CorpityCorpMock extends MockResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpMock>) {
    super(name, new MockResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
