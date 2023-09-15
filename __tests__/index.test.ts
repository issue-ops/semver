/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main'

describe('index', () => {
  it('calls run when imported', async () => {
    const runMock = jest.spyOn(main, 'run').mockImplementation()

    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
