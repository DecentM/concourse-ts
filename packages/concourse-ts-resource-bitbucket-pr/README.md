<h1 align="center">
  concourse-ts-resource-bitbucket-pr
</h1>

<div align="center">

  Typed BitbucketPr resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-bitbucket-pr`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-bitbucket-pr`

## Usage

The BitbucketPr resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BitbucketPrResource, BitbucketPrResourceType} from '@decentm/concourse-ts-resource-bitbucket-pr'

export class CorpityCorpBitbucketPr extends BitbucketPrResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBitbucketPr>) {
    super(name, new BitbucketPrResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
