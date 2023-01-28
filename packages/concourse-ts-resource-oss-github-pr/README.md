<h1 align="center">
  concourse-ts-resource-oss-github-pr
</h1>

<div align="center">

  Typed OssGithubPr resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-oss-github-pr`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-oss-github-pr`

## Usage

The OssGithubPr resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {OssGithubPrResource, OssGithubPrResourceType} from '@decentm/concourse-ts-resource-oss-github-pr'

export class CorpityCorpOssGithubPr extends OssGithubPrResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpOssGithubPr>) {
    super(name, new OssGithubPrResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
