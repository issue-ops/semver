import * as octokit from './octokit.js'

export const getOctokit = () => octokit

export const context = {
  runId: 1234,
  job: 'job-name',
  payload: {},
  repo: {
    owner: 'USPS',
    repo: 'fast-track-deployment-manifest-action'
  }
}
