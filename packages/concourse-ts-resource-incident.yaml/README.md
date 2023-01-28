<h1 align="center">
  concourse-ts-resource-incident.yaml
</h1>

<div align="center">

  Typed Incident.yaml resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-incident.yaml`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-incident.yaml`

## Usage

The Incident.yaml resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {Incident.yamlResource, Incident.yamlResourceType} from '@decentm/concourse-ts-resource-incident.yaml'

export class CorpityCorpIncident.yaml extends Incident.yamlResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpIncident.yaml>) {
    super(name, new Incident.yamlResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
