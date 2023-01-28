<h1 align="center">
  concourse-ts-resource-incident
</h1>

<div align="center">

  Typed Incident resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-incident`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-incident`

## Usage

The Incident resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {IncidentResource, IncidentResourceType} from '@decentm/concourse-ts-resource-incident'

export class CorpityCorpIncident extends IncidentResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpIncident>) {
    super(name, new IncidentResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
