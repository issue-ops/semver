import * as core from '@actions/core'
import fs from 'fs'
import * as toml from 'toml'
import { XMLParser } from 'fast-xml-parser'

/**
 * A parsed, SemVer-compliant version
 */
export class Version {
  major: string | number
  minor: string | number
  patch: string | number
  prerelease?: string | number

  /**
   * Create a new Version instance from a version string
   *
   * @param version A SemVer-compliant version string
   */
  constructor(version: string) {
    core.info(`Parsing version: ${version}`)

    // (https://semver.org/#spec-item-10) Build metadata can be discarded
    version = version.split('+')[0]

    // (https://semver.org/#spec-item-9) Prerelease is separated by a `-`
    if (version.includes('-')) {
      this.prerelease = version.split('-')[1]
      version = version.split('-')[0]
    }

    const splitVersion = version.split('.')

    // Some frameworks just don't add minor/patch versions
    this.major = splitVersion[0]
    this.minor = splitVersion[1] ?? '0'
    this.patch = splitVersion[2] ?? '0'

    // Check if prerelease was separated with a '.' instead of a '-'
    if (this.prerelease === undefined && version.split('.').length > 3)
      this.prerelease = splitVersion.slice(3).join('.')

    if (this.major === undefined || this.major === '')
      throw new Error(`Invalid version string!`)

    core.info(`Parsed version: ${this.toString()}`)
  }

  /**
   * Print the version as a string
   *
   * @param prefix True to include the 'v' prefix (e.g. 'v1.2.3')
   * @returns The version as a string
   */
  toString(prefix: boolean = true): string {
    return `${prefix ? 'v' : ''}${this.major}.${this.minor}.${this.patch}${
      this.prerelease ? `-${this.prerelease}` : ''
    }`
  }

  /**
   * Infer the version from the project workspace
   *
   * @param workspace The project workspace
   * @returns The version as a Version instance
   */
  static infer(workspace: string): Version | undefined {
    // Supported manifest files
    // Node.js: package.json
    // Python: pyproject.toml, setup.cfg, setup.py
    // Java: pom.xml

    const manifests = [
      'package.json',
      'pyproject.toml',
      'setup.cfg',
      'setup.py',
      'pom.xml'
    ]

    for (const manifest of manifests) {
      try {
        // Try to read the manifest file
        const body = fs.readFileSync(`${workspace}/${manifest}`, 'utf8')

        switch (manifest) {
          case 'package.json': {
            const jsonBody = JSON.parse(body)

            if (jsonBody.version !== undefined)
              return new Version(jsonBody.version)
            break
          }
          case 'pyproject.toml': {
            const tomlBody = toml.parse(body)

            const version =
              tomlBody.project?.version || tomlBody.tool?.poetry?.version

            if (version !== undefined) return new Version(version)
            break
          }
          case 'setup.cfg': {
            const regex: RegExp = /version\s?=\s?['"]?(?<version>[^'"\n]+)/
            const version = body.match(regex)?.groups?.version

            if (version !== undefined) return new Version(version)
            break
          }
          case 'setup.py': {
            const regex: RegExp =
              /version\s?=\s?['"](?<version>[^'"\r\n]+)['"],?/
            const version = body.match(regex)?.groups?.version

            if (version !== undefined) return new Version(version)
            break
          }
          case 'pom.xml': {
            const parser = new XMLParser()
            const xml = parser.parse(body)
            const version = xml.project?.version

            if (version !== undefined) return new Version(version.toString())
            break
          }
        }
      } catch (error: any) {
        // Ignore file not found errors
        if (error.code !== 'ENOENT') throw error
      }
    }

    return undefined
  }
}
