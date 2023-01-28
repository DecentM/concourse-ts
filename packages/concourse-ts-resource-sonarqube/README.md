<h1 align="center">
  concourse-ts-resource-sonarqube
</h1>

<div align="center">

  Typed Sonarqube resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-sonarqube`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-sonarqube`

## Usage

The Sonarqube resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {SonarqubeResource, SonarqubeResourceType} from '@decentm/concourse-ts-resource-sonarqube'

export class CorpityCorpSonarqube extends SonarqubeResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSonarqube>) {
    super(name, new SonarqubeResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
