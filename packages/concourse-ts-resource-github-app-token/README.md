<h1 align="center">
  concourse-ts-resource-github-app-token
</h1>

<div align="center">

  Typed GithubAppToken resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-github-app-token`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-github-app-token`

## Usage

The GithubAppToken resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {GithubAppTokenResource, GithubAppTokenResourceType} from '@decentm/concourse-ts-resource-github-app-token'

export class CorpityCorpGithubAppToken extends GithubAppTokenResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpGithubAppToken>) {
    super(name, new GithubAppTokenResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
