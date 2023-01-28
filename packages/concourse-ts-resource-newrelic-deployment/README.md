<h1 align="center">
  concourse-ts-resource-newrelic-deployment
</h1>

<div align="center">

  Typed 22NewrelicDeployment resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-newrelic-deployment`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-newrelic-deployment`

## Usage

The 22NewrelicDeployment resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {22NewrelicDeploymentResource, 22NewrelicDeploymentResourceType} from '@decentm/concourse-ts-resource-newrelic-deployment'

export class CorpityCorp22NewrelicDeployment extends 22NewrelicDeploymentResource {
  constructor(name: string, init?: Type.Initer<CorpityCorp22NewrelicDeployment>) {
    super(name, new 22NewrelicDeploymentResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
