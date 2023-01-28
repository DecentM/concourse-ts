<h1 align="center">
  concourse-ts-resource-rubygems
</h1>

<div align="center">

  Typed Rubygems resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-rubygems`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-rubygems`

## Usage

The Rubygems resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {RubygemsResource, RubygemsResourceType} from '@decentm/concourse-ts-resource-rubygems'

export class CorpityCorpRubygems extends RubygemsResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpRubygems>) {
    super(name, new RubygemsResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
