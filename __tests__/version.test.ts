/**
 * Unit tests for the action's version functionality, src/version.ts
 */
import { exec } from '@actions/exec'
import fs from 'fs'
import { Version } from '../src/version'

// Mock the exec package
jest.mock('@actions/exec')

// Mock debug and info logging
jest.mock('@actions/core', () => {
  const actual = jest.requireActual('@actions/core')
  return {
    ...actual,
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
})

describe('version', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('removes a leading "v"', async () => {
    expect(new Version('v1.2.3-alpha.4').major).toEqual('1')
    expect(new Version('V1.2.3-alpha.4').major).toEqual('1')
  })

  it('fails if an invalid version string was passed to the constructor', async () => {
    try {
      // Pass an invalid version
      expect(new Version('....')).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('Invalid version string!')
    }
  })

  it('sets a prerelease if present', async () => {
    // Pass a valid version with a prerelease
    expect(new Version('1.2.3-alpha.4').prerelease).toEqual('alpha.4')
  })

  it('ignores build metadata', async () => {
    // Pass a valid version with build metadata
    expect(new Version('1.2.3-alpha.4+build.5').prerelease).toEqual('alpha.4')
  })

  it('infers the version from valid manifests', async () => {
    // Pass each valid manifest file
    expect(
      Version.infer('./fixtures/valid/java/pom.xml', __dirname)?.toString()
    ).toEqual('8.0.0')
    expect(
      Version.infer(
        './fixtures/valid/python/pyproject.toml',
        __dirname
      )?.toString()
    ).toEqual('1.2.3')
    expect(
      Version.infer(
        './fixtures/valid/python-poetry/pyproject.toml',
        __dirname
      )?.toString()
    ).toEqual('3.4.5')
    expect(
      Version.infer('./fixtures/valid/python/setup.cfg', __dirname)?.toString()
    ).toEqual('7.8.9')
    expect(
      Version.infer('./fixtures/valid/python/setup.py', __dirname)?.toString()
    ).toEqual('5.6.0')
    expect(
      Version.infer('./fixtures/valid/node/package.json', __dirname)?.toString()
    ).toEqual('9.8.7')
    expect(
      Version.infer('./fixtures/valid/other/.version', __dirname)?.toString()
    ).toEqual('1.2.3-pre.4+build.12345')
    expect(
      Version.infer('./fixtures/valid/dart/pubspec.yaml', __dirname)?.toString()
    ).toEqual('1.2.3-alpha.4+build.5')
  })

  it('does not infer the version from invalid manifests', async () => {
    // Pass each invalid manifest file
    expect(Version.infer('./fixtures/invalid/java/pom.xml', __dirname)).toEqual(
      undefined
    )
    expect(
      Version.infer('./fixtures/invalid/python/pyproject.toml', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer(
        './fixtures/invalid/python-poetry/pyproject.toml',
        __dirname
      )
    ).toEqual(undefined)
    expect(
      Version.infer('./fixtures/invalid/python/setup.cfg', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('./fixtures/invalid/python/setup.py', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('./fixtures/invalid/node/package.json', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('./fixtures/invalid/other/.version', __dirname)?.toString()
    ).toEqual(undefined)
    expect(
      Version.infer(
        './fixtures/invalid/dart/pubspec.yaml',
        __dirname
      )?.toString()
    ).toEqual(undefined)
  })

  it('throws if a manifest file is not readable', async () => {
    // Mock the readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not readable')
    })

    try {
      expect(
        Version.infer('./fixtures/invalid/unreadable/package.json', __dirname)
      ).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('File not readable')
    }
  })

  it('returns undefined if a manifest file is not found', async () => {
    // Mock the readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'File not found',
        code: 'ENOENT'
      }
    })

    expect(
      Version.infer('./fixtures/invalid/unreadable/package.json', __dirname)
    ).toBe(undefined)
  })

  it('throws an error if a manifest path is invalid', async () => {
    try {
      expect(Version.infer('path/to/', __dirname)).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('Invalid manifest path: path/to/')
    }

    try {
      expect(Version.infer('///', __dirname)).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('Invalid manifest path: //')
    }

    try {
      expect(Version.infer('/', __dirname)).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('Invalid manifest path: ')
    }

    try {
      expect(Version.infer('', __dirname)).toThrow()
    } catch (error: any) {
      expect(error.message).toBe('Invalid manifest path: ')
    }
  })

  it('returns a version string with or without the leading v', async () => {
    // Try both with and without the leading v
    expect(new Version('1.2.3').toString()).toEqual('1.2.3')
    expect(new Version('1.2.3').toString(true)).toEqual('v1.2.3')
    expect(new Version('1.2.3').toString(false)).toEqual('1.2.3')
  })

  it('only updates the prerelease tag if it is present', async () => {
    // Mock the exec package to return successful exit codes and set the
    // stdout and stderr accordingly
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4+build.5"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4+build.5'")
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3-alpha.4'"))
          return Promise.resolve(0)
        }

        if (
          commandLine === 'git push origin --delete "v1.2.3-alpha.4+build.5"'
        ) {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4+build.5'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git tag "v1.2.3-alpha.4+build.5" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag "v1.2.3-alpha.4" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --tags') {
          // Pushing a tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n * [new tag]         v1.2.3-alpha.4 -> v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4+build.5')
    await version.tag('main', `${__dirname}/fixtures/valid`)

    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1.2.3-alpha.4+build.5"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1.2.3-alpha.4"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag -d "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag -d "v1.2"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag -d "v1"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3-alpha.4+build.5"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3-alpha.4"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git push origin --delete "v1.2"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git push origin --delete "v1"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1.2.3-alpha.4+build.5" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1.2.3-alpha.4" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag "v1.2.3" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag "v1.2" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).not.toHaveBeenCalledWith(
      'git tag "v1" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      `git push origin --tags`,
      [],
      expect.any(Object)
    )
  })

  it('throws an error if deleting a tag fails', async () => {
    // Mock the exec package to return an error when deleting a tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        options.listeners.stderr(Buffer.from('Failed to delete tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(await version.tag('main', `${__dirname}/fixtures/valid`)).toThrow()
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
  })

  it('throws an error if pushing a delete fails', async () => {
    // Mock the exec package to return an error when pushing a delete
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3-alpha.4'"))
          return Promise.resolve(0)
        }

        options.listeners.stderr(Buffer.from('Failed to push deleted tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(await version.tag('main', `${__dirname}/fixtures/valid`)).toThrow()
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
  })

  it('throws an error if creating a tag fails', async () => {
    // Mock the exec package to return an error when creating a tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3-alpha.4'"))
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        options.listeners.stderr(Buffer.from('Failed to create tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(await version.tag('main', `${__dirname}/fixtures/valid`)).toThrow()
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
  })

  it('throws an error if pushing a tag fails', async () => {
    // Mock the exec package to return an error when pushing a tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3-alpha.4'"))
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git tag "v1.2.3-alpha.4" "main"') {
          return Promise.resolve(0)
        }

        options.listeners.stderr(Buffer.from('Failed to push tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(await version.tag('main', `${__dirname}/fixtures/valid`)).toThrow()
      // eslint-disable-next-line no-empty
    } catch (error: any) {}
  })

  it('updates all tags if prerelease tag is not present', async () => {
    // Mock the exec package to return successful exit codes and set the
    // stdout and stderr accordingly
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3+build.5"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3+build.5'"))
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2.3"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2.3'"))
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(Buffer.from("Deleted tag 'v1.2'"))
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1"') {
          // Deleting the existing tag writes to stdout
          options.listeners.stdout(Buffer.from("Deleted tag 'v1'"))
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3+build.5"') {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3+build.5'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2.3"') {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2"') {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1"') {
          // Successfully deleting the remote tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1'
            )
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git tag "v1.2.3+build.5" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag "v1.2.3" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag "v1.2" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag "v1" "main"') {
          // Creating a new tag doesn't write anything
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --tags') {
          // Pushing a tag writes to stderr
          options.listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n * [new tag]         v1.2.3 -> v1.2.3\n * [new tag]         v1.2 -> v1.2 * [new tag]         v1 -> v1'
            )
          )
          return Promise.resolve(0)
        }

        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3+build.5')
    await version.tag('main', `${__dirname}/fixtures/valid`)

    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1.2.3+build.5"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1.2"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag -d "v1"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3+build.5"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1.2"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git push origin --delete "v1"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1.2.3+build.5" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1.2.3" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1.2" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      'git tag "v1" "main"',
      [],
      expect.any(Object)
    )
    expect(execMock).toHaveBeenCalledWith(
      `git push origin --tags`,
      [],
      expect.any(Object)
    )
  })

  it('exists returns true if the tag exists', async () => {
    // Mock the exec package to return the tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        options.listeners.stdout(Buffer.from('v1.2.3-alpha.4'))
        return Promise.resolve(0)
      }
    )

    const version = new Version('1.2.3-alpha.4')

    expect(await version.exists(`${__dirname}/fixtures/valid`, false)).toBe(
      true
    )
  })

  it('exists returns false if the tag does not exist', async () => {
    // Mock the exec package to return the tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        options.listeners.stdout(Buffer.from(''))
        return Promise.resolve(0)
      }
    )

    const version = new Version('1.2.3-alpha.4')

    expect(await version.exists(`${__dirname}/fixtures/valid`, false)).toBe(
      false
    )
  })

  it('exists returns false if the tag exists but prereleases are allowed', async () => {
    // Mock the exec package to return the tag
    const execMock = exec as jest.MockedFunction<typeof exec>
    execMock.mockImplementation(
      (
        commandLine: string,
        args?: string[],
        options?: any
      ): Promise<number> => {
        options.listeners.stdout(Buffer.from('1.2.3-alpha.4'))
        return Promise.resolve(0)
      }
    )

    const version = new Version('1.2.3-alpha.4')

    expect(await version.exists(`${__dirname}/fixtures/valid`, true)).toBe(
      false
    )
  })
})
