/**
 * Unit tests for the action's entrypoint, src/index.ts
 */
import * as main from '../src/main'

let runMock: jest.SpyInstance

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    runMock = jest.spyOn(main, 'run').mockImplementation()
  })

  it('calls run when imported', async () => {
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
