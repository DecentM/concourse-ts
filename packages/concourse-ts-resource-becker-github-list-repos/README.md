<h1 align="center">
  concourse-ts-resource-becker-github-list-repos
</h1>

<div align="center">

  Typed BeckerGithubListRepos resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-becker-github-list-repos`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-becker-github-list-repos`

## Usage

The BeckerGithubListRepos resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {BeckerGithubListReposResource, BeckerGithubListReposResourceType} from '@decentm/concourse-ts-resource-becker-github-list-repos'

export class CorpityCorpBeckerGithubListRepos extends BeckerGithubListReposResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpBeckerGithubListRepos>) {
    super(name, new BeckerGithubListReposResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
