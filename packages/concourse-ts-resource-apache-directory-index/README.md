<h1 align="center">
  concourse-ts-resource-apache-directory-index
</h1>

<div align="center">

  Typed ApacheDirectoryIndex resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-apache-directory-index`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-apache-directory-index`

## Usage

The ApacheDirectoryIndex resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ApacheDirectoryIndexResource, ApacheDirectoryIndexResourceType} from '@decentm/concourse-ts-resource-apache-directory-index'

export class CorpityCorpApacheDirectoryIndex extends ApacheDirectoryIndexResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpApacheDirectoryIndex>) {
    super(name, new ApacheDirectoryIndexResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
