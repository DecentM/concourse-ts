<h1 align="center">
  concourse-ts-resource-bugsnag-build
</h1>

<div align="center">

  Typed BugsnagBuild resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-bugsnag-build`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-bugsnag-build`

## Usage

The BugsnagBuild resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BugsnagBuildResource, BugsnagBuildResourceType} from '@decentm/concourse-ts-resource-bugsnag-build'

export class CorpityCorpBugsnagBuild extends BugsnagBuildResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBugsnagBuild>) {
    super(name, new BugsnagBuildResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
