/**
 * Unit tests for the action's main functionality, src/main.ts
 */

import * as core from '@actions/core'
import fs from 'fs'
import { Version } from '../src/version'

const infoMock = jest.spyOn(core, 'info').mockImplementation()

describe('version', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws if an invalid version was passed as input', async () => {
    try {
      expect(new Version('....')).toThrow()
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('sets a prerelease if present', async () => {
    expect(new Version('1.2.3-alpha.4').prerelease).toEqual('alpha.4')
    expect(new Version('1.2.3-4.3.2.1').prerelease).toEqual('4.3.2.1')
  })

  it('ignores build metadata', async () => {
    expect(new Version('1.2.3+build.4').toString()).toEqual('v1.2.3')
  })

  it('infers the version from a valid pom.xml', async () => {
    const version = Version.infer(`${__dirname}/fixtures/valid/java-pom`)
    expect(infoMock).toHaveBeenCalledWith('Parsed version: v8.0.0')
    expect(version?.toString()).toEqual('v8.0.0')
  })

  it('infers the version from a valid pyproject.toml', async () => {
    const version = Version.infer(`${__dirname}/fixtures/valid/python`)
    expect(infoMock).toHaveBeenCalledWith('Parsed version: v1.2.3')
    expect(version?.toString()).toEqual('v1.2.3')
  })

  it('infers the version from a valid pyproject.toml (poetry)', async () => {
    const version = Version.infer(`${__dirname}/fixtures/valid/python-poetry`)
    expect(infoMock).toHaveBeenCalledWith('Parsed version: v3.4.5')
    expect(version?.toString()).toEqual('v3.4.5')
  })

  it('infers the version from a valid setup.cfg', async () => {
    const version = Version.infer(
      `${__dirname}/fixtures/valid/python-setup-cfg`
    )

    expect(infoMock).toHaveBeenCalledWith('Parsed version: v7.8.9')
    expect(version?.toString()).toEqual('v7.8.9')
  })

  it('infers the version from a valid setup.py', async () => {
    const version = Version.infer(`${__dirname}/fixtures/valid/python-setup-py`)
    expect(infoMock).toHaveBeenCalledWith('Parsed version: v5.6.0')
    expect(version?.toString()).toEqual('v5.6.0')
  })

  it('infers the version from a valid package.json', async () => {
    const version = Version.infer(`${__dirname}/fixtures/valid/node-package`)
    expect(infoMock).toHaveBeenCalledWith('Parsed version: v9.8.7')
    expect(version?.toString()).toEqual('v9.8.7')
  })

  it('does not infer the version from an invalid pom.xml', async () => {
    const version = Version.infer(`${__dirname}/fixtures/invalid/java-pom`)
    expect(version).toEqual(undefined)
  })

  it('does not infer the version from an invalid pyproject.toml', async () => {
    const version = Version.infer(`${__dirname}/fixtures/invalid/python`)
    expect(version).toEqual(undefined)
  })

  it('does not infer the version from an invalid pyproject.toml (poetry)', async () => {
    const version = Version.infer(`${__dirname}/fixtures/invalid/python-poetry`)
    expect(version).toEqual(undefined)
  })

  it('does not infer the version from an invalid setup.cfg', async () => {
    const version = Version.infer(
      `${__dirname}/fixtures/invalid/python-setup-cfg`
    )
    expect(version).toEqual(undefined)
  })

  it('does not infer the version from an invalid setup.py', async () => {
    const version = Version.infer(
      `${__dirname}/fixtures/invalid/python-setup-py`
    )
    expect(version).toEqual(undefined)
  })

  it('does not infer the version from an invalid package.json', async () => {
    const version = Version.infer(`${__dirname}/fixtures/invalid/node-package`)
    expect(version).toEqual(undefined)
  })

  it('does not infer the version if no supported file exists', async () => {
    const version = Version.infer(`${__dirname}/fixtures/invalid/no-file`)
    expect(version).toEqual(undefined)
  })

  it('throws if a manifest file is not readable', async () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not readable')
    })

    try {
      Version.infer(`${__dirname}/fixtures/invalid/unreadable`)
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('returns a version string with the leading `v` if requested', async () => {
    expect(new Version('1.2.3').toString()).toEqual('v1.2.3')
  })

  it('returns a version string without the leading `v` if requested', async () => {
    expect(new Version('1.2.3').toString(false)).toEqual('1.2.3')
  })
})
