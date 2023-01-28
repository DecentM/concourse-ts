<h1 align="center">
  concourse-ts-resource-appcenter.yaml
</h1>

<div align="center">

  Typed Appcenter.yaml resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-appcenter.yaml`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-appcenter.yaml`

## Usage

The Appcenter.yaml resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {Appcenter.yamlResource, Appcenter.yamlResourceType} from '@decentm/concourse-ts-resource-appcenter.yaml'

export class CorpityCorpAppcenter.yaml extends Appcenter.yamlResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpAppcenter.yaml>) {
    super(name, new Appcenter.yamlResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
