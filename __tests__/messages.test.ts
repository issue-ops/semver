import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as github from '../__fixtures__/github.js'

jest.unstable_mockModule('@actions/github', () => github)
jest.unstable_mockModule('@actions/core', () => core)

const messages = await import('../src/messages.js')

const { getOctokit } = await import('@actions/github')
const mocktokit = jest.mocked(getOctokit('MY_TOKEN'))

describe('messages', () => {
  beforeEach(() => {
    core.getInput.mockReturnValue('MY_TOKEN')
    process.env.GITHUB_REPOSITORY = 'issue-ops/semver'
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getCommentId()', () => {
    it('returns the ID of the existing comment', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: [
          {
            id: 1,
            body: 'test comment\n\n<!-- semver: workflow=workflow-name -->'
          }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const commentId = await messages.getCommentId()
      expect(commentId).toBe(1)
    })

    it('returns undefined if no existing comment is present', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const commentId = await messages.getCommentId()
      expect(commentId).toBe(undefined)
    })
  })

  describe('versionCheckComment()', () => {
    it('updates an existing comment (success)', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: [
          {
            id: 1,
            body: 'test comment\n\n<!-- semver: workflow=workflow-name -->'
          }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      await messages.versionCheckComment(true, 'package.json')

      expect(mocktokit.rest.issues.updateComment).toHaveBeenCalled()
    })

    it('updates an existing comment (failure)', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: [
          {
            id: 1,
            body: 'test comment\n\n<!-- semver: workflow=workflow-name -->'
          }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      await messages.versionCheckComment(false, 'package.json')

      expect(mocktokit.rest.issues.updateComment).toHaveBeenCalled()
    })

    it('creates a new comment (success)', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      await messages.versionCheckComment(true, 'package.json')

      expect(mocktokit.rest.issues.createComment).toHaveBeenCalled()
    })

    it('creates a new comment (failure)', async () => {
      mocktokit.rest.issues.listComments.mockResolvedValue({
        data: []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      await messages.versionCheckComment(false, 'package.json')

      expect(mocktokit.rest.issues.createComment).toHaveBeenCalled()
    })
  })
})
