<h1 align="center">
  concourse-ts-resource-s3
</h1>

<div align="center">

  Typed S3 resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-s3`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-s3`

## Usage

The S3 resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {S3Resource, S3ResourceType} from '@decentm/concourse-ts-resource-s3'

export class CorpityCorpS3 extends S3Resource {
  constructor(name: string, init?: Type.Initer<CorpityCorpS3>) {
    super(name, new S3ResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
