<h1 align="center">
  concourse-ts-resource-concourse-pipeline
</h1>

<div align="center">

  Typed ConcoursePipeline resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-pipeline`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-pipeline`

## Usage

The ConcoursePipeline resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcoursePipelineResource, ConcoursePipelineResourceType} from '@decentm/concourse-ts-resource-concourse-pipeline'

export class CorpityCorpConcoursePipeline extends ConcoursePipelineResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcoursePipeline>) {
    super(name, new ConcoursePipelineResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
