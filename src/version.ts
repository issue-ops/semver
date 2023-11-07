import * as core from '@actions/core'
import fs from 'fs'
import * as toml from 'toml'
import { exec } from '@actions/exec'
import { TagOptions } from './options'

/**
 * A parsed, SemVer-compliant version, along with parsing and tagging utilities
 */
export class Version {
  // The prerelease version is optional
  major: string | number
  minor: string | number
  patch: string | number
  prerelease?: string | number

  /**
   * Create a new Version instance from a version string
   *
   * @param version A (hopefully) SemVer-compliant version string
   */
  constructor(version: string) {
    core.info(`Input version string: ${version}`)

    // Build metadata is separated by a `+`
    // https://semver.org/#spec-item-10
    // TODO: Would we eventually want to support this?
    const buildMetadata = version.split('+')[1] ?? ''
    version = version.split('+')[0]
    core.info(`Discarded build metadata: ${buildMetadata}`)

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

    // If the split version string has more than 3 items, assume those are part
    // of the prerelease (if not already present)
    // E.g: `1.2.3.alpha.4` -> `1.2.3-alpha.4`
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
    return `${prefix ? 'v' : ''}${this.major}.${this.minor}.${this.patch}${
      this.prerelease ? `-${this.prerelease}` : ''
    }`
  }

  /**
   * Infer the version from the project workspace
   * Supported manifest files:
   * - Node.js: package.json
   * - Python: pyproject.toml, setup.cfg, setup.py
   * - Java: pom.xml
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
        return body.match(/<version>(?<version>[^<]+)/)?.groups?.version
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
      } else {
        throw error
      }
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

    // If this is a prerelease, only update the prerelease tag. Otherwise,
    // update the major, minor, and patch tags.
    // TODO: Do we want to update the prerelease tag all the time?
    const tags = this.prerelease
      ? [`v${this.major}.${this.minor}.${this.patch}-${this.prerelease}`]
      : [
          `v${this.major}`,
          `v${this.major}.${this.minor}`,
          `v${this.major}.${this.minor}.${this.patch}`
        ]

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
  }

  /**
   * Checks if the version tags already exist in the repository
   *
   * @param manifestPath The path to the manifest file
   * @param workspace The project workspace
   * @returns True if the version tags exist, otherwise false
   */
  async exists(workspace: string): Promise<boolean> {
    // There's no need to check for anything other than the "full" tag (with the
    // prerelease, if present). The major.minor or major tags may exist and can
    // be moved.
    core.info(`Checking for tag: v${this.toString(true)}`)

    const tagOptions: TagOptions = new TagOptions(workspace)

    await exec(`git tag -l "${this.toString(true)}"`, [], tagOptions.options)

    core.debug(`STDOUT: ${tagOptions.stdout}`)
    core.debug(`STDERR: ${tagOptions.stderr}`)

    if (tagOptions.stdout.includes(this.toString(true))) return true
    else return false
  }
}
