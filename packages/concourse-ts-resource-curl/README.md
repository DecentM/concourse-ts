<h1 align="center">
  concourse-ts-resource-curl
</h1>

<div align="center">

  Typed Curl resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-curl`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-curl`

## Usage

The Time resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import * as ConcourseTs from '@decentm/concourse-ts'
import * as Curl from '@decentm/concourse-ts-resource-curl'

const curl_resource_type: Curl.ResourceType =
  new ConcourseTs.ResourceType('curl', (curl_resource_type) => {
    curl_resource_type.type = 'registry-image'

    curl_resource_type.source = {
      // ...
    }
  })

const curl_resource: Curl.Resource = new ConcourseTs.Resource('curl_resource')
```
