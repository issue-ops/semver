import { jest } from '@jest/globals'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as core from '../__fixtures__/core.js'
import * as exec from '../__fixtures__/exec.js'
import * as octokit from '../__fixtures__/octokit.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Mock the exec package
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/exec', () => exec)
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

const { Version } = await import('../src/version.js')

describe('version.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Removes a leading "v"', async () => {
    expect(new Version('v1.2.3-alpha.4').major).toEqual('1')
    expect(new Version('V1.2.3-alpha.4').major).toEqual('1')
  })

  it('Fails if an invalid version string was passed to the constructor', async () => {
    try {
      // Pass an invalid version
      expect(new Version('....')).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('Sets a prerelease if present', async () => {
    // Pass a valid version with a prerelease
    expect(new Version('1.2.3-alpha.4').prerelease).toEqual('alpha.4')
  })

  it('Ignores build metadata', async () => {
    // Pass a valid version with build metadata
    expect(new Version('1.2.3-alpha.4+build.5').prerelease).toEqual('alpha.4')
  })

  it('Infers the version from valid manifests', async () => {
    // Pass each valid manifest file
    expect(
      Version.infer('../__fixtures__/valid/java/pom.xml', __dirname)?.toString()
    ).toEqual('8.0.0')
    expect(
      Version.infer(
        '../__fixtures__/valid/github/action.yaml',
        __dirname
      )?.toString()
    ).toEqual('1.2.3')
    expect(
      Version.infer(
        '../__fixtures__/valid/github/action.yml',
        __dirname
      )?.toString()
    ).toEqual('1.2.3')
    expect(
      Version.infer(
        '../__fixtures__/valid/python/pyproject.toml',
        __dirname
      )?.toString()
    ).toEqual('1.2.3')
    expect(
      Version.infer(
        '../__fixtures__/valid/python-poetry/pyproject.toml',
        __dirname
      )?.toString()
    ).toEqual('3.4.5')
    expect(
      Version.infer(
        '../__fixtures__/valid/python/setup.cfg',
        __dirname
      )?.toString()
    ).toEqual('7.8.9')
    expect(
      Version.infer(
        '../__fixtures__/valid/python/setup.py',
        __dirname
      )?.toString()
    ).toEqual('5.6.0')
    expect(
      Version.infer(
        '../__fixtures__/valid/node/package.json',
        __dirname
      )?.toString()
    ).toEqual('9.8.7')
    expect(
      Version.infer(
        '../__fixtures__/valid/other/.version',
        __dirname
      )?.toString()
    ).toEqual('1.2.3-pre.4+build.12345')
    expect(
      Version.infer(
        '../__fixtures__/valid/dart/pubspec.yaml',
        __dirname
      )?.toString()
    ).toEqual('1.2.3-alpha.4+build.5')
    expect(
      Version.infer(
        '../__fixtures__/valid/csharp/example.csproj',
        __dirname
      )?.toString()
    ).toEqual('1.2.3-alpha.4+build.5')
  })

  it('Does not infer the version from invalid manifests', async () => {
    // Pass each invalid manifest file
    expect(
      Version.infer('../__fixtures__/invalid/java/pom.xml', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/github/action.yaml', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/github/action.yml', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/python/pyproject.toml', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer(
        '../__fixtures__/invalid/python-poetry/pyproject.toml',
        __dirname
      )
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/python/setup.cfg', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/python/setup.py', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer('../__fixtures__/invalid/node/package.json', __dirname)
    ).toEqual(undefined)
    expect(
      Version.infer(
        '../__fixtures__/invalid/other/.version',
        __dirname
      )?.toString()
    ).toEqual(undefined)
    expect(
      Version.infer(
        '../__fixtures__/invalid/dart/pubspec.yaml',
        __dirname
      )?.toString()
    ).toEqual(undefined)
    expect(
      Version.infer(
        '../__fixtures__/invalid/csharp/example.csproj',
        __dirname
      )?.toString()
    ).toEqual(undefined)
  })

  it('Throws if a manifest file is not readable', async () => {
    // Mock the readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not readable')
    })

    try {
      expect(
        Version.infer('./fixtures/invalid/unreadable/package.json', __dirname)
      ).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('Returns undefined if a manifest file is not found', async () => {
    // Mock the readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw {
        message: 'File not found',
        code: 'ENOENT'
      }
    })

    expect(
      Version.infer('./fixtures/invalid/unreadable/package.json', __dirname)
    ).toBe(undefined)
  })

  it('Throws an error if a manifest path is invalid', async () => {
    try {
      expect(Version.infer('path/to/', __dirname)).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }

    try {
      expect(Version.infer('///', __dirname)).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }

    try {
      expect(Version.infer('/', __dirname)).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }

    try {
      expect(Version.infer('', __dirname)).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('Returns a version string with or without the leading v', async () => {
    // Try both with and without the leading v
    expect(new Version('1.2.3').toString()).toEqual('1.2.3')
    expect(new Version('1.2.3').toString(true)).toEqual('v1.2.3')
    expect(new Version('1.2.3').toString(false)).toEqual('1.2.3')
  })

  it('Only updates the prerelease tag if it is present', async () => {
    // Mock the exec package to return successful exit codes and set the
    // stdout and stderr accordingly
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4+build.5"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4+build.5'")
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4'")
          )
          return Promise.resolve(0)
        }

        if (
          commandLine === 'git push origin --delete "v1.2.3-alpha.4+build.5"'
        ) {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4+build.5'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
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
    await version.tag('main', `${__dirname}/fixtures/valid`, true)

    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1.2.3-alpha.4+build.5"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1.2.3-alpha.4"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag -d "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag -d "v1.2"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag -d "v1"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3-alpha.4+build.5"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3-alpha.4"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git push origin --delete "v1.2"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git push origin --delete "v1"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1.2.3-alpha.4+build.5" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1.2.3-alpha.4" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag "v1.2.3" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag "v1.2" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).not.toHaveBeenCalledWith(
      'git tag "v1" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      `git push origin --tags`,
      [],
      expect.any(Object)
    )
  })

  it('throws an error if deleting a tag fails', async () => {
    // Mock the exec package to return an error when deleting a tag
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stderr(Buffer.from('Failed to delete tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(
        await version.tag('main', `${__dirname}/fixtures/valid`, true)
      ).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('throws an error if pushing a delete fails', async () => {
    // Mock the exec package to return an error when pushing a delete
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4'")
          )
          return Promise.resolve(0)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stderr(
          Buffer.from('Failed to push deleted tag')
        )
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(
        await version.tag('main', `${__dirname}/fixtures/valid`, true)
      ).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('throws an error if creating a tag fails', async () => {
    // Mock the exec package to return an error when creating a tag
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4'")
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stderr(Buffer.from('Failed to create tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(
        await version.tag('main', `${__dirname}/fixtures/valid`, true)
      ).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('throws an error if pushing a tag fails', async () => {
    // Mock the exec package to return an error when pushing a tag
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3-alpha.4"') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3-alpha.4'")
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3-alpha.4"') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3-alpha.4'
            )
          )
          return Promise.resolve(0)
        }

        if (commandLine === 'git tag "v1.2.3-alpha.4" "main"') {
          return Promise.resolve(0)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stderr(Buffer.from('Failed to push tag'))
        return Promise.resolve(1)
      }
    )

    const version = new Version('1.2.3-alpha.4')
    try {
      expect(
        await version.tag('main', `${__dirname}/fixtures/valid`, true)
      ).toThrow()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
  })

  it('updates all tags if prerelease tag is not present', async () => {
    // Mock the exec package to return successful exit codes and set the
    // stdout and stderr accordingly
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        if (commandLine === 'git tag -d "v1.2.3+build.5"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3+build.5'")
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2.3"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(
            Buffer.from("Deleted tag 'v1.2.3'")
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1.2"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(Buffer.from("Deleted tag 'v1.2'"))
          return Promise.resolve(0)
        }
        if (commandLine === 'git tag -d "v1"') {
          // Deleting the existing tag writes to stdout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stdout(Buffer.from("Deleted tag 'v1'"))
          return Promise.resolve(0)
        }

        if (commandLine === 'git push origin --delete "v1.2.3+build.5"') {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3+build.5'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2.3"') {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2.3'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1.2"') {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
            Buffer.from(
              'To github.com:issue-ops/testing-repo.git\n - [deleted]         v1.2'
            )
          )
          return Promise.resolve(0)
        }
        if (commandLine === 'git push origin --delete "v1"') {
          // Successfully deleting the remote tag writes to stderr
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(options as any).listeners.stderr(
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
    await version.tag('main', `${__dirname}/fixtures/valid`, true)

    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1.2.3+build.5"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1.2"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag -d "v1"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3+build.5"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1.2.3"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1.2"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git push origin --delete "v1"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1.2.3+build.5" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1.2.3" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1.2" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      'git tag "v1" "main"',
      [],
      expect.any(Object)
    )
    expect(exec.exec).toHaveBeenCalledWith(
      `git push origin --tags`,
      [],
      expect.any(Object)
    )
  })

  it('exists returns true if the tag exists', async () => {
    // Mock the exec package to return the tag
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stdout(Buffer.from('v1.2.3-alpha.4'))
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
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stdout(Buffer.from(''))
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
    exec.exec.mockImplementation(
      (
        commandLine: unknown,
        args?: unknown,
        options?: unknown
      ): Promise<number> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any).listeners.stdout(Buffer.from('1.2.3-alpha.4'))
        return Promise.resolve(0)
      }
    )

    const version = new Version('1.2.3-alpha.4')

    expect(await version.exists(`${__dirname}/fixtures/valid`, true)).toBe(
      false
    )
  })
})

describe('constructor', () => {
  it('parses a version string without leading "v"', () => {
    const version = new Version('1.2.3')
    expect(version.major).toEqual('1')
    expect(version.minor).toEqual('2')
    expect(version.patch).toEqual('3')
    expect(version.prerelease).toBeUndefined()
    expect(version.build).toBeUndefined()
  })

  it('parses a version string with leading "v"', () => {
    const version = new Version('v1.2.3')
    expect(version.major).toEqual('1')
    expect(version.minor).toEqual('2')
    expect(version.patch).toEqual('3')
    expect(version.prerelease).toBeUndefined()
    expect(version.build).toBeUndefined()
  })

  it('parses a version string with prerelease', () => {
    const version = new Version('1.2.3-alpha.4')
    expect(version.major).toEqual('1')
    expect(version.minor).toEqual('2')
    expect(version.patch).toEqual('3')
    expect(version.prerelease).toEqual('alpha.4')
    expect(version.build).toBeUndefined()
  })

  it('parses a version string with build metadata', () => {
    const version = new Version('1.2.3+build.5')
    expect(version.major).toEqual('1')
    expect(version.minor).toEqual('2')
    expect(version.patch).toEqual('3')
    expect(version.prerelease).toBeUndefined()
    expect(version.build).toEqual('build.5')
  })

  it('parses a version string with prerelease and build metadata', () => {
    const version = new Version('1.2.3-alpha.4+build.5')
    expect(version.major).toEqual('1')
    expect(version.minor).toEqual('2')
    expect(version.patch).toEqual('3')
    expect(version.prerelease).toEqual('alpha.4')
    expect(version.build).toEqual('build.5')
  })

  it('throws an error for an invalid version string', () => {
    expect(() => new Version('....')).toThrow('Invalid version string!')
  })
})
