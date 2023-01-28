<h1 align="center">
  concourse-ts-resource-tracker
</h1>

<div align="center">

  Typed Tracker resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-tracker`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-tracker`

## Usage

The Tracker resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {TrackerResource, TrackerResourceType} from '@decentm/concourse-ts-resource-tracker'

export class CorpityCorpTracker extends TrackerResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpTracker>) {
    super(name, new TrackerResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
