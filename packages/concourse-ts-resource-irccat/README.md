<h1 align="center">
  concourse-ts-resource-irccat
</h1>

<div align="center">

  Typed Irccat resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-irccat`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-irccat`

## Usage

The Irccat resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {IrccatResource, IrccatResourceType} from '@decentm/concourse-ts-resource-irccat'

export class CorpityCorpIrccat extends IrccatResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpIrccat>) {
    super(name, new IrccatResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
