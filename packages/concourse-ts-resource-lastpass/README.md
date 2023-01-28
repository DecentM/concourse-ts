<h1 align="center">
  concourse-ts-resource-lastpass
</h1>

<div align="center">

  Typed Lastpass resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-lastpass`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-lastpass`

## Usage

The Lastpass resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {LastpassResource, LastpassResourceType} from '@decentm/concourse-ts-resource-lastpass'

export class CorpityCorpLastpass extends LastpassResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpLastpass>) {
    super(name, new LastpassResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
