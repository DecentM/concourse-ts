<h1 align="center">
  concourse-ts-resource-concourse-sonarqube-notifier
</h1>

<div align="center">

  Typed ConcourseSonarqubeNotifier resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-sonarqube-notifier`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-sonarqube-notifier`

## Usage

The ConcourseSonarqubeNotifier resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseSonarqubeNotifierResource, ConcourseSonarqubeNotifierResourceType} from '@decentm/concourse-ts-resource-concourse-sonarqube-notifier'

export class CorpityCorpConcourseSonarqubeNotifier extends ConcourseSonarqubeNotifierResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseSonarqubeNotifier>) {
    super(name, new ConcourseSonarqubeNotifierResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
