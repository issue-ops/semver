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
    setFailed: jest.fn(),
    setOutput: jest.fn()
  }
})

const runMock = jest.spyOn(main, 'run')

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fails if both manifest-path and use-version are not set', async () => {
    // Return empty string for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((): string => {
      return ''
    })
    const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

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
    const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

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
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
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
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4'),
      tag: jest.fn()
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
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
        default:
          return ''
      }
    })
    const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

    // Mock the return value from Version.infer()
    jest.spyOn(Version, 'infer').mockReturnValue(undefined)

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith('Could not infer version')
    expect(runMock).toHaveReturned()
  })

  it('infers a valid version', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return '.'
        case 'manifest-path':
          return '/fixtures/valid/node/package.json'
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
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4'),
      tag: jest.fn()
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
    expect(setOutputMock).toHaveBeenCalledWith('version', '1.2.3-alpha.4')
    expect(runMock).toHaveReturned()
  })

  it('creates a valid version', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

    // Ignore the version.tag() call
    jest.spyOn(Version.prototype, 'tag').mockImplementation()

    // Return valid values for all inputs
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'use-version':
          return '1.2.3-alpha.4'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setOutputMock).toHaveBeenCalledWith('version', '1.2.3-alpha.4')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor', '1.2')
    expect(setOutputMock).toHaveBeenCalledWith('major', '1')
    expect(setOutputMock).toHaveBeenCalledWith('minor', '2')
    expect(setOutputMock).toHaveBeenCalledWith('patch', '3')
    expect(setOutputMock).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(runMock).toHaveReturned()
  })
})
