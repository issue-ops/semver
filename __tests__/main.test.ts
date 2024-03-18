/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import * as core from '@actions/core'
import * as main from '../src/main'
import { Version } from '../src/version'

// Mock debug and info logging
jest.mock('@actions/core', () => {
  const actual = jest.requireActual('@actions/core')
  return {
    ...actual,
    debug: jest.fn(),
    getInput: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    setFailed: jest.fn(),
    setOutput: jest.fn()
  }
})

let infoMock: jest.SpyInstance
let runMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    infoMock = jest.spyOn(core, 'info').mockImplementation()
    runMock = jest.spyOn(main, 'run')
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('fails if both manifest-path and use-version are not set', async () => {
    // Return empty string for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return ''
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'Must provide manifest-path OR use-version'
    )
    expect(runMock).toHaveReturned()
  })

  it('fails if both manifest-path and use-version are set', async () => {
    // Return the same value for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return 'Set ALL THE INPUTS!'
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'Must provide manifest-path OR use-version'
    )
    expect(runMock).toHaveReturned()
  })

  it('gets the inputs', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'true'
        default:
          return ''
      }
    })

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
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(runMock).toHaveReturned()
  })

  it('fails if a version could not be inferred', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'true'
        default:
          return ''
      }
    })

    // Mock the return value from Version.infer()
    jest.spyOn(Version, 'infer').mockReturnValue(undefined)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('Could not infer version')
    expect(runMock).toHaveReturned()
  })

  it('infers a valid version', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'true'
        default:
          return ''
      }
    })

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
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setOutputMock).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor', '1.2')
    expect(setOutputMock).toHaveBeenCalledWith('major', '1')
    expect(setOutputMock).toHaveBeenCalledWith('minor', '2')
    expect(setOutputMock).toHaveBeenCalledWith('patch', '3')
    expect(setOutputMock).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(setOutputMock).toHaveBeenCalledWith('build', 'build.5')
    expect(setOutputMock).toHaveBeenCalledWith(
      'version',
      '1.2.3-alpha.4+build.5'
    )
    expect(runMock).toHaveReturned()
  })

  it('creates a valid version', async () => {
    // Ignore the version.tag() call
    jest.spyOn(Version.prototype, 'tag').mockImplementation()

    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'use-version':
          return '1.2.3-alpha.4+build.5'
        case 'overwrite':
          return 'true'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setOutputMock).toHaveBeenCalledWith(
      'version',
      '1.2.3-alpha.4+build.5'
    )
    expect(setOutputMock).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor', '1.2')
    expect(setOutputMock).toHaveBeenCalledWith('major', '1')
    expect(setOutputMock).toHaveBeenCalledWith('minor', '2')
    expect(setOutputMock).toHaveBeenCalledWith('patch', '3')
    expect(setOutputMock).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(setOutputMock).toHaveBeenCalledWith('build', 'build.5')
    expect(runMock).toHaveReturned()
  })

  it('does not set prerelease or build outputs if they are not present', async () => {
    // Ignore the version.tag() call
    jest.spyOn(Version.prototype, 'tag').mockImplementation()

    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'use-version':
          return '1.2.3'
        case 'overwrite':
          return 'true'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setOutputMock).not.toHaveBeenCalledWith(
      'version',
      '1.2.3-alpha.4+build.5'
    )
    expect(setOutputMock).not.toHaveBeenCalledWith('version', '1.2.3-alpha.4')
    expect(setOutputMock).toHaveBeenCalledWith('version', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor', '1.2')
    expect(setOutputMock).toHaveBeenCalledWith('major', '1')
    expect(setOutputMock).toHaveBeenCalledWith('minor', '2')
    expect(setOutputMock).toHaveBeenCalledWith('patch', '3')
    expect(setOutputMock).not.toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(setOutputMock).not.toHaveBeenCalledWith('build', 'build.5')
    expect(runMock).toHaveReturned()
  })

  it('fails if the version exists and overwrite is false', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'false'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'false'
        default:
          return ''
      }
    })

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
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      "Version already exists and 'overwrite' is false"
    )
    expect(runMock).toHaveReturned()
  })

  it('fails if the version exists and check-only is true', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'true'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'false'
        default:
          return ''
      }
    })

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
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      "Version already exists and 'check-only' is true"
    )
    expect(runMock).toHaveReturned()
  })

  it('passes if the version exists and check-only is false', async () => {
    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'check-only':
          return 'true'
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        case 'overwrite':
          return 'false'
        default:
          return ''
      }
    })

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
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(infoMock).toHaveBeenCalledWith(
      "Version does not exist and 'check-only' is true"
    )
    expect(runMock).toHaveReturned()
  })
})
