import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * Gets the PR comment ID that contains the previous version check comment, if
 * it exists.
 *
 * @returns The ID of the previous version check comment, or undefined
 */
export async function getCommentId(): Promise<number | undefined> {
  const octokit = github.getOctokit(core.getInput('token', { required: true }))

  // Unique identifier for the version check comment.
  const identifier = `<!-- semver: workflow=${github.context.workflow} -->`

  // If no existing comment is found, set the result to undefined.
  let commentId: number | undefined = undefined

  const response = await octokit.rest.issues.listComments({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number
  })

  for (const comment of response.data)
    if (comment.body?.includes(identifier)) commentId = comment.id

  return commentId
}

/**
 * Comments on the pull request when a version check succeeds or fails.
 *
 * @param success Whether the version check succeeded or failed
 * @param manifestPath The path to the manifest file being checked
 */
export async function versionCheckComment(
  success: boolean,
  manifestPath: string
): Promise<void> {
  const octokit = github.getOctokit(core.getInput('token', { required: true }))

  const successBody = [
    '### Semantic Version Check Passed :white_check_mark:',
    `Version in manifest file \`${manifestPath}\` is valid.`,
    'This comment will be automatically updated as changes are pushed to this PR branch.',
    `<!-- semver: workflow=${github.context.workflow} -->`
  ].join('\n\n')

  const failureBody = [
    '### Semantic Version Check Failed :x:',
    `Version in manifest file \`${manifestPath}\` has already been published. Please increment the version in the manifest file before attempting to merge this pull request.`,
    'This comment will be automatically updated as changes are pushed to this PR branch.',
    `<!-- semver: workflow=${github.context.workflow} -->`
  ].join('\n\n')

  // Update the existing comment, or create a new one.
  const commentId = await getCommentId()

  if (commentId !== undefined)
    await octokit.rest.issues.updateComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: commentId,
      body: success ? successBody : failureBody
    })
  else
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      body: success ? successBody : failureBody
    })
}
