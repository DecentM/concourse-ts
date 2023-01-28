<h1 align="center">
  concourse-ts-resource-sonarqube.yaml
</h1>

<div align="center">

  Typed Sonarqube.yaml resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-sonarqube.yaml`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-sonarqube.yaml`

## Usage

The Sonarqube.yaml resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {Sonarqube.yamlResource, Sonarqube.yamlResourceType} from '@decentm/concourse-ts-resource-sonarqube.yaml'

export class CorpityCorpSonarqube.yaml extends Sonarqube.yamlResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpSonarqube.yaml>) {
    super(name, new Sonarqube.yamlResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
