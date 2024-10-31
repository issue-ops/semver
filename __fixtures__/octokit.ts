import { jest } from '@jest/globals'

export const graphql = jest.fn()
export const paginate = jest.fn()
export const rest = {
  actions: {
    createOrUpdateEnvironmentSecret: jest.fn(),
    createOrUpdateRepoSecret: jest.fn(),
    createEnvironmentVariable: jest.fn(),
    createRepoVariable: jest.fn(),
    getEnvironmentPublicKey: jest.fn(),
    getRepoPublicKey: jest.fn(),
    updateRepoVariable: jest.fn()
  },
  codespaces: {
    createOrUpdateRepoSecret: jest.fn(),
    getRepoPublicKey: jest.fn()
  },
  issues: {
    addLabels: jest.fn(),
    createComment: jest.fn(),
    get: jest.fn(),
    listComments: jest.fn(),
    removeLabel: jest.fn(),
    update: jest.fn(),
    updateComment: jest.fn()
  },
  orgs: {
    checkMembershipForUser: jest.fn()
  },
  pulls: {
    create: jest.fn(),
    listFiles: jest.fn()
  },
  repos: {
    get: jest.fn(),
    getContent: jest.fn()
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: jest.fn(),
    addOrUpdateRepoPermissionsInOrg: jest.fn(),
    getByName: jest.fn(),
    getMembershipForUserInOrg: jest.fn()
  }
}
