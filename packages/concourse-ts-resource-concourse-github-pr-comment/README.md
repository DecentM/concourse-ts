<h1 align="center">
  concourse-ts-resource-concourse-github-pr-comment
</h1>

<div align="center">

  Typed ConcourseGithubPrComment resource for concourse-ts
</div>

## Installation

`npm i --save-dev @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-github-pr-comment`

`yarn add -D @decentm/concourse-ts @decentm/concourse-ts-resource-concourse-github-pr-comment`

## Usage

The ConcourseGithubPrComment resource is a typed class that extends the base Resource class.
Therefore, it has the same properties. See the Resource documentation for details.

```typescript
import {Type} from '@decentm/concourse-ts'
import {ConcourseGithubPrCommentResource, ConcourseGithubPrCommentResourceType} from '@decentm/concourse-ts-resource-concourse-github-pr-comment'

export class CorpityCorpConcourseGithubPrComment extends ConcourseGithubPrCommentResource {
  constructor(name: string, init?: Type.Initer<CorpityCorpConcourseGithubPrComment>) {
    super(name, new ConcourseGithubPrCommentResourceType(/*...*/))

    // Set defaults here

    if (init) {
      init(this)
    }
  }
}
```
