<h1 align="center">
  concourse-ts-resource-fly
</h1>

<div align="center">

  Typed Fly resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-fly`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-fly`

## Usage

This resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import * as ConcourseTs from '@decentm/concourse-ts'
import * as Fly from '@decentm/concourse-ts-resource-fly'

const fly_resource_type: Fly.ResourceType =
  new ConcourseTs.ResourceType('fly', (fly_resource_type) => {
    fly_resource_type.type = 'registry-image'

    fly_resource_type.source = {
      // ...
    }
  })

const fly_resource: Fly.Resource = new ConcourseTs.Resource('fly_resource')
```
