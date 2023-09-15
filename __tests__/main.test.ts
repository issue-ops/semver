/**
 * Unit tests for the action's main functionality, src/main.ts
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import { Version } from '../src/version'

const infoMock = jest.spyOn(core, 'info').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fails if workspace and version are not set', async () => {
    getInputMock.mockImplementation((): string => {
      return ''
    })

    await main.run()

    expect(setFailedMock).toHaveBeenCalledWith(
      'Either workspace or version must be defined'
    )
  })

  it('fails if workspace and version are both set', async () => {
    getInputMock.mockImplementation((): string => {
      return 'Both values are set!'
    })

    await main.run()

    expect(setFailedMock).toHaveBeenCalledWith(
      'Either workspace or version must be defined'
    )
  })

  it('gets the ref input', async () => {
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

    await main.run()

    expect(infoMock).toHaveBeenCalledWith('Ref: refs/heads/main')
  })

  it('fails if a version could not be inferred', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'workspace':
          return './fixtures/valid'
        default:
          return ''
      }
    })

    Version.infer = jest.fn().mockImplementation(() => {
      return undefined
    })

    await main.run()

    expect(setFailedMock).toHaveBeenCalledWith('Could not infer version')
  })

  it('succeeds if a version can be inferred', async () => {
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

    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4')
    } as Version

    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(infoMock).toHaveBeenCalledWith('Inferred Version: 1.2.3-alpha.4')
  })

  it('succeeds if a valid version was passed as input', async () => {
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

    const mockVersion = {
      major: '1',
      minor: '2',
      patch: '3',
      prerelease: 'alpha.4',
      toString: jest.fn().mockReturnValue('1.2.3-alpha.4')
    } as Version

    jest.spyOn(Version.prototype, 'toString').mockReturnValue('1.2.3-alpha.4')
    jest.spyOn(Version, 'infer').mockReturnValue(mockVersion)

    await main.run()

    expect(infoMock).toHaveBeenCalledWith('Inferred Version: 1.2.3-alpha.4')
  })
})
