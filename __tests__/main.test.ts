/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import * as core from '@actions/core'
import * as main from '../src/main'
import { Version } from '../src/version'

const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

const runMock = jest.spyOn(main, 'run')

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fails if both workspace and version are not set', async () => {
    // Return empty string for all inputs
    getInputMock.mockImplementation((): string => {
      return ''
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'Must provide workspace OR version'
    )
    expect(runMock).toHaveReturned()
  })

  it('fails if both workspace and version are set', async () => {
    // Return the same value for all inputs
    getInputMock.mockImplementation((): string => {
      return 'Set ALL THE INPUTS!'
    })

    await main.run()

    expect(runMock).toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalledWith(
      'Must provide workspace OR version'
    )
    expect(runMock).toHaveReturned()
  })

  it('gets the inputs', async () => {
    // Return valid values for all inputs
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return './fixtures/valid'
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
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return './fixtures/valid'
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
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'workspace':
          return './fixtures/valid'
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
    expect(setOutputMock).toHaveBeenCalledWith('version', '1.2.3-alpha.4')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor-patch', '1.2.3')
    expect(setOutputMock).toHaveBeenCalledWith('major-minor', '1.2')
    expect(setOutputMock).toHaveBeenCalledWith('major', '1')
    expect(setOutputMock).toHaveBeenCalledWith('minor', '2')
    expect(setOutputMock).toHaveBeenCalledWith('patch', '3')
    expect(setOutputMock).toHaveBeenCalledWith('prerelease', 'alpha.4')
    expect(runMock).toHaveReturned()
  })

  it('creates a valid version', async () => {
    // Return valid values for all inputs
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'ref':
          return 'refs/heads/main'
        case 'version':
          return '1.2.3-alpha.4'
        default:
          return ''
      }
    })

    // Ignore the version.tag() call
    jest.spyOn(Version.prototype, 'tag').mockImplementation()

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
