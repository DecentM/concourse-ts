<h1 align="center">
  concourse-ts-resource-datetime-version
</h1>

<div align="center">

  Typed DatetimeVersion resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-datetime-version`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-datetime-version`

## Usage

The DatetimeVersion resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {DatetimeVersionResource, DatetimeVersionResourceType} from '@decentm/concourse-ts-resource-datetime-version'

export class CorpityCorpDatetimeVersion extends DatetimeVersionResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpDatetimeVersion>) {
    super(name, new DatetimeVersionResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
