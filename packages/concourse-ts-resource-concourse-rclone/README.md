<h1 align="center">
  concourse-ts-resource-concourse-rclone
</h1>

<div align="center">

  Typed ConcourseRclone resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-rclone`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-rclone`

## Usage

The ConcourseRclone resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseRcloneResource, ConcourseRcloneResourceType} from '@decentm/concourse-ts-resource-concourse-rclone'

export class CorpityCorpConcourseRclone extends ConcourseRcloneResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseRclone>) {
    super(name, new ConcourseRcloneResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
