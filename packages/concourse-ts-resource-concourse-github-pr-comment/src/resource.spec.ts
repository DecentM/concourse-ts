import test from 'ava'

import { ConcourseGithubPrCommentResource } from './resource'
import { ConcourseGithubPrCommentResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseGithubPrCommentResourceType('my-concourse-github-pr-comment-resource_type')
  const r = new ConcourseGithubPrCommentResource('my-concourse-github-pr-comment-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-github-pr-comment-resource')
})
