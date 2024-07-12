import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as octokit from '../__fixtures__/octokit.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }
  }

  return {
    Octokit
  }
})
jest.unstable_mockModule('../src/version.js', async () => {
  class Version {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static infer: jest.MockedFunction<any>
    constructor() {
      return {
        tag: jest.fn()
      }
    }
  }

  Version.infer = jest.fn()

  return {
    Version
  }
})

const main = await import('../src/main.js')
const { Version } = await import('../src/version.js')

describe('main', () => {
  beforeEach(() => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('true') // allow-prerelease
      .mockReturnValueOnce('false') // check-only
      .mockReturnValueOnce('/fixtures/valid/node/package.json') // manifest-path
      .mockReturnValueOnce('true') // overwrite
      .mockReturnValueOnce('refs/heads/main') // ref
      .mockReturnValueOnce('') // use-version
      .mockReturnValueOnce('.') // workspace
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('fails if both manifest-path and use-version are not set', async () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('true') // allow-prerelease
      .mockReturnValueOnce('false') // check-only
      .mockReturnValueOnce('') // manifest-path
      .mockReturnValueOnce('true') // overwrite
      .mockReturnValueOnce('refs/heads/main') // ref
      .mockReturnValueOnce('') // use-version
      .mockReturnValueOnce('.') // workspace

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Must provide manifest-path OR use-version'
    )
  })

  it('fails if both manifest-path and use-version are set', async () => {
    // Return the same value for all inputs
    core.getInput
      .mockReset()
      .mockReturnValueOnce('true') // allow-prerelease
      .mockReturnValueOnce('false') // check-only
      .mockReturnValueOnce('/fixtures/valid/node/package.json') // manifest-path
      .mockReturnValueOnce('true') // overwrite
      .mockReturnValueOnce('refs/heads/main') // ref
      .mockReturnValueOnce('1.2.3') // use-version
      .mockReturnValueOnce('.') // workspace

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Must provide manifest-path OR use-version'
    )
  })

  it('gets the inputs', async () => {
    // Mock the return value from Version.infer()
    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      build: 'build.5',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4+build.5'),
      tag: jest.fn(),
      exists: jest.fn().mockImplementation(() => false)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.mocked(Version.infer).mockReturnValue(mockVersion as any)

    await main.run()

    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('fails if a version could not be inferred', async () => {
    // Mock the return value from Version.infer()
    jest.mocked(Version.infer).mockReturnValue(undefined)

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith('Could not infer version')
  })

  it('infers a valid version', async () => {
    // Mock the return value from Version.infer()
    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      build: 'build.5',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4+build.5'),
      tag: jest.fn(),
      exists: jest.fn().mockImplementation(() => false)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.mocked(Version.infer).mockReturnValue(mockVersion as any)

    await main.run()

    expect(core.setOutput).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(core.setOutput).toHaveBeenCalledWith('major-minor', '1.2')
    expect(core.setOutput).toHaveBeenCalledWith('major', '1')
    expect(core.setOutput).toHaveBeenCalledWith('minor', '2')
    expect(core.setOutput).toHaveBeenCalledWith('patch', '3')
    expect(core.setOutput).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(core.setOutput).toHaveBeenCalledWith('build', 'build.5')
    expect(core.setOutput).toHaveBeenCalledWith(
      'version',
      '1.2.3-alpha.4+build.5'
    )
  })

  it('creates a valid version', async () => {
    // Mock the return value from Version.infer()
    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      build: 'build.5',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4+build.5'),
      tag: jest.fn(),
      exists: jest.fn().mockImplementation(() => false)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.mocked(Version.infer).mockReturnValue(mockVersion as any)

    await main.run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'version',
      '1.2.3-alpha.4+build.5'
    )
    expect(core.setOutput).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(core.setOutput).toHaveBeenCalledWith('major-minor', '1.2')
    expect(core.setOutput).toHaveBeenCalledWith('major', '1')
    expect(core.setOutput).toHaveBeenCalledWith('minor', '2')
    expect(core.setOutput).toHaveBeenCalledWith('patch', '3')
    expect(core.setOutput).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(core.setOutput).toHaveBeenCalledWith('build', 'build.5')
  })

  it('fails if the version exists and overwrite is false', async () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('true') // allow-prerelease
      .mockReturnValueOnce('false') // check-only
      .mockReturnValueOnce('/fixtures/valid/node/package.json') // manifest-path
      .mockReturnValueOnce('false') // overwrite
      .mockReturnValueOnce('refs/heads/main') // ref
      .mockReturnValueOnce('') // use-version
      .mockReturnValueOnce('.') // workspace

    // Mock the return value from Version.infer()
    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      build: 'build.5',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4+build.5'),
      tag: jest.fn(),
      exists: jest.fn().mockImplementation(() => true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.mocked(Version.infer).mockReturnValue(mockVersion as any)

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      "Version already exists and 'overwrite' is false"
    )
  })

  it('fails if the version exists and check-only is true', async () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce('true') // allow-prerelease
      .mockReturnValueOnce('true') // check-only
      .mockReturnValueOnce('/fixtures/valid/node/package.json') // manifest-path
      .mockReturnValueOnce('false') // overwrite
      .mockReturnValueOnce('refs/heads/main') // ref
      .mockReturnValueOnce('') // use-version
      .mockReturnValueOnce('.') // workspace

    // Mock the return value from Version.infer()
    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      build: 'build.5',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4+build.5'),
      tag: jest.fn(),
      exists: jest.fn().mockReturnValue(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.mocked(Version.infer).mockReturnValue(mockVersion as any)

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      "Version already exists and 'check-only' is true"
    )
  })
})
