import * as core from '@actions/core'
import { exec } from '@actions/exec'

import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import * as toml from 'toml'
import yaml from 'yaml'

import { TagOptions } from './options'

/**
 * A parsed, SemVer-compliant version, along with parsing and tagging utilities
 */
export class Version {
  /** Major Version */
  major: string | number
  /** Minor Version */
  minor: string | number
  /** Patch Version */
  patch: string | number
  /** Prerelease Version */
  prerelease?: string | number
  /** Build Metadata */
  build?: string | number

  /**
   * Create a new Version instance from a version string
   *
   * @param version A (hopefully) SemVer-compliant version string
   */
  constructor(version: string) {
    core.info(`Input version string: ${version}`)

    if (version.startsWith('v') || version.startsWith('V'))
      version = version.slice(1)

    // Build metadata is separated by a `+`
    // https://semver.org/#spec-item-10
    this.build = version.split('+')[1]
    version = version.split('+')[0]
    core.info(`Parsed build: ${this.build}`)

    // Prerelease *should* be separated by a `-`...sometimes it isn't
    // https://semver.org/#spec-item-9
    if (version.includes('-')) {
      this.prerelease = version.split('-')[1]
      version = version.split('-')[0]
      core.info(`Parsed prerelease: ${this.prerelease}`)
    }

    // Split the version into major, minor, and patch
    const splitVersion = version.split('.')
    core.info(`Split version: ${JSON.stringify(splitVersion)}`)

    // Some frameworks just don't add minor/patch versions (e.g. `1` or `1.0`)
    this.major = splitVersion[0]
    this.minor = splitVersion[1] ? splitVersion[1] : '0'
    this.patch = splitVersion[2] ? splitVersion[2] : '0'

    core.info(`Parsed major: ${this.major}`)
    core.info(`Parsed minor: ${this.minor}`)
    core.info(`Parsed patch: ${this.patch}`)

    // If the split version string has more than 3 items, assume the remaining
    // are part of the prerelease (e.g: `1.2.3.alpha.4` -> `1.2.3-alpha.4`)
    if (this.prerelease === undefined && version.split('.').length > 3) {
      this.prerelease = splitVersion.slice(3).join('.')
      core.info(`Parsed prerelease: ${this.prerelease}`)
    }

    // At minimum, major version must be defined
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
  toString(prefix: boolean = false): string {
    let version = prefix ? 'v' : ''
    version += `${this.major}.${this.minor}.${this.patch}`

    if (this.prerelease) version += `-${this.prerelease}`
    if (this.build) version += `+${this.build}`

    return version
  }

  /**
   * Infer the version from the project workspace
   * Supported manifest files:
   * - Node.js: package.json
   * - Python: pyproject.toml, setup.cfg, setup.py
   * - Java: pom.xml
   * - Dart: pubspec.yaml
   * TODO: C#, C++, Go, Rust, Ruby, Swift, etc.
   *
   * @param manifestPath The path to the manifest file
   * @param workspace The project workspace
   * @returns The version instance
   */
  static infer(manifestPath: string, workspace: string): Version | undefined {
    // Remove leading/trailing slashes from workspace and manifest path
    workspace = workspace.replace(/\/$/, '')
    manifestPath = manifestPath.replace(/^\//, '')

    // Get the file name and extension from the manifest path
    const items: string[] = manifestPath.split('/')
    const manifestFile: string = items[items.length - 1]
    core.info(`Manifest file: ${manifestFile}`)

    if (manifestFile === '')
      throw new Error(`Invalid manifest path: ${manifestPath}`)

    // Functions for parsing each type of manifest file
    // eslint-disable-next-line no-unused-vars
    const parser: { [k: string]: (body: string) => string | undefined } = {
      'package.json': (body: string): string | undefined => {
        return JSON.parse(body).version
      },
      'pyproject.toml': (body: string): string | undefined => {
        const tomlBody = toml.parse(body)
        return tomlBody.project?.version || tomlBody.tool?.poetry?.version
      },
      'setup.cfg': (body: string): string | undefined => {
        return body.match(/version\s?=\s?['"]?(?<version>[^'"\n]+)/)?.groups
          ?.version
      },
      'setup.py': (body: string): string | undefined => {
        return body.match(/version\s?=\s?['"](?<version>[^'"\r\n]+)['"],?/)
          ?.groups?.version
      },
      'pom.xml': (body: string): string | undefined => {
        return new XMLParser().parse(body).project?.version?.toString()
      },
      'pubspec.yaml': (body: string): string | undefined => {
        const yamlBody = yaml.parse(body)
        return yamlBody.version
      },
      '.version': (body: string): string | undefined => {
        // Ref: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
        return body.match(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
        )?.[0]
      }
    }

    try {
      core.info(`Reading manifest: ${workspace}/${manifestPath}`)

      const body = fs.readFileSync(`${workspace}/${manifestPath}`, 'utf8')
      const version = parser[manifestFile]?.(body)

      core.info(`Inferred version: ${version}`)

      // Return undefined if no version was found, otherwise return a new
      // instance of the Version class
      return version === undefined ? undefined : new Version(version)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        core.error('Manifest not found')
        return undefined
      } else throw error
    }
  }

  /**
   * Tag the ref with the inferred version tags
   *
   * @param ref The ref to tag
   * @param workspace The project workspace
   */
  async tag(ref: string, workspace: string): Promise<void> {
    const tagOptions: TagOptions = new TagOptions(workspace)
    const tags: string[] = []

    if (this.prerelease) {
      // Builds that contain a prerelease version should only update:
      // - `major.minor.patch-prerelease` (e.g. `v1.2.3-alpha.4`)
      // - `major.minor.patch-prerelease+build` (e.g. `v1.2.3-alpha.4+build.5`)
      tags.push(`v${this.major}.${this.minor}.${this.patch}-${this.prerelease}`)
      if (this.build)
        tags.push(
          `v${this.major}.${this.minor}.${this.patch}-${this.prerelease}+${this.build}`
        )
    } else {
      // Builds that do not contain a prerelease version should update:
      // - `major` (e.g. `v1`)
      // - `major.minor` (e.g. `v1.2`)
      // - `major.minor.patch` (e.g. `v1.2.3`)
      // - `major.minor.patch+build` (e.g. `v1.2.3+build.4`)
      tags.push(`v${this.major}`)
      tags.push(`v${this.major}.${this.minor}`)
      tags.push(`v${this.major}.${this.minor}.${this.patch}`)
      if (this.build)
        tags.push(`v${this.major}.${this.minor}.${this.patch}+${this.build}`)
    }

    core.info(`Tags to update: ${JSON.stringify(tags)}`)

    for (const tag of tags) {
      // Delete the tag
      core.info(`Deleting tag: ${tag}`)
      tagOptions.reset()

      await exec(`git tag -d "${tag}"`, [], tagOptions.options)

      core.debug(`STDOUT: ${tagOptions.stdout}`)
      core.debug(`STDERR: ${tagOptions.stderr}`)

      // Git writes to stderr when tag deletes are successful
      // Ignore stderr if the tag does not exist or was deleted
      if (
        tagOptions.stderr !== '' &&
        tagOptions.stderr.includes(`error: tag '${tag}' not found.`) === false
      )
        throw new Error(tagOptions.stderr)

      // Push the delete to the remote
      // This should be done before creating the tag locally to avoid conflicts
      core.info(`Deleting remote tag: ${tag}`)
      tagOptions.reset()

      await exec(`git push origin --delete "${tag}"`, [], tagOptions.options)

      core.debug(`STDOUT: ${tagOptions.stdout}`)
      core.debug(`STDERR: ${tagOptions.stderr}`)

      // Git writes to stderr when tag deletes are pushed successfully
      // Ignore stderr if the tag does not exist or was deleted
      if (
        tagOptions.stderr.includes('[deleted]') === false &&
        tagOptions.stderr.includes('remote ref does not exist') === false
      )
        throw new Error(tagOptions.stderr)

      // Create the tag locally
      core.info(`Creating tag locally: ${tag}`)
      tagOptions.reset()

      await exec(`git tag "${tag}" "${ref}"`, [], tagOptions.options)

      core.debug(`STDOUT: ${tagOptions.stdout}`)
      core.debug(`STDERR: ${tagOptions.stderr}`)

      // Git writes to stderr when tags are created successfully
      if (tagOptions.stderr !== '') throw new Error(tagOptions.stderr)
    }

    // Push the tag(s)
    core.info(`Pushing tag(s): ${JSON.stringify(tags)}`)
    tagOptions.reset()

    await exec('git push origin --tags', [], tagOptions.options)

    core.debug(`STDOUT: ${tagOptions.stdout}`)
    core.debug(`STDERR: ${tagOptions.stderr}`)

    // Git writes to stderr when tags are pushed successfully
    // Ignore stderr if the tag was pushed
    if (tagOptions.stderr.includes('[new tag]') === false)
      throw new Error(tagOptions.stderr)

    core.info('Tagging complete')
  }

  /**
   * Checks if the version tags already exist in the repository
   *
   * If there is a build number, that should be included in the check. If there
   * is a prerelease, that should also be included. Otherwise, only the
   * `major.minor.patch` tag needs to be checked. The `major.minor` and `major`
   * tags "float" (they move with the more specific patch version). The
   * `toString` method of this class already accounts for this behavior.
   *
   * @param workspace The project workspace
   * @param allowPrerelease True to allow prerelease version conflicts
   * @returns True if the version tags exist, otherwise false
   */
  async exists(workspace: string, allowPrerelease: boolean): Promise<boolean> {
    core.info(`Checking for tag: ${this.toString(true)}`)

    const tagOptions: TagOptions = new TagOptions(workspace)

    await exec(`git tag -l "${this.toString(true)}"`, [], tagOptions.options)

    core.debug(`STDOUT: ${tagOptions.stdout}`)
    core.debug(`STDERR: ${tagOptions.stderr}`)

    if (this.prerelease && allowPrerelease) {
      core.info('Prerelease version conflict allowed')
      return false
    }

    if (tagOptions.stdout.includes(this.toString(true))) return true
    else return false
  }
}
