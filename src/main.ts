import * as core from '@actions/core'
import * as github from '@actions/github'
import { versionCheckComment } from './messages.js'
import { Version } from './version.js'

export async function run() {
  const allowPrerelease: boolean = core.getInput('allow-prerelease') === 'true'
  const checkOnly: boolean = core.getInput('check-only') === 'true'
  const manifestPath: string = core.getInput('manifest-path')
  const overwrite: boolean = core.getInput('overwrite') === 'true'
  const ref: string = core.getInput('ref')
  const useVersion: string = core.getInput('use-version')
  const workspace: string = core.getInput('workspace')
  const push: boolean = core.getInput('push-tags') === 'true'

  if (
    (manifestPath === '' && useVersion === '') ||
    (manifestPath !== '' && useVersion !== '')
  )
    return core.setFailed('Must provide manifest-path OR use-version')

  core.info('Running action with inputs:')
  core.info(`\tAllow Prerelease: ${allowPrerelease}`)
  core.info(`\tCheck: ${checkOnly}`)
  core.info(`\tManifest Path: ${manifestPath}`)
  core.info(`\tOverwrite: ${overwrite}`)
  core.info(`\tRef: ${ref}`)
  core.info(`\tUse Version: ${useVersion}`)
  core.info(`\tWorkspace: ${workspace}`)

  // Get version from input string, or infer it from the workspace
  /* istanbul ignore next */
  const version: Version | undefined = useVersion
    ? new Version(useVersion)
    : Version.infer(manifestPath, workspace)

  if (version === undefined) return core.setFailed('Could not infer version')
  core.info(`Inferred Version: ${version.toString()}`)

  // Check if the version exists.
  const exists = await version.exists(workspace, allowPrerelease)

  /* istanbul ignore next */
  if (github.context?.issue?.number !== undefined)
    await versionCheckComment(exists, manifestPath)

  // Fail if checkOnly is true and the version exists.
  if (checkOnly && exists)
    return core.setFailed("Version exists and 'check-only' is true")

  // Fail if not running in checkOnly mode, not allowing overwrites, and the
  // version exists.
  if (!checkOnly && !overwrite && exists)
    return core.setFailed("Version exists and 'overwrite' is false")

  // If not running in checkOnly mode, tag and push the version in the
  // workspace. Otherwise, just output the version information.
  /* istanbul ignore else */
  if (!checkOnly) await version.tag(ref, workspace, push)
  else core.info("Version does not exist and 'check-only' is true")

  // Output the various version formats
  // [X.Y.Z-PRE+BUILD, X.Y.Z, X.Y, X, Y, Z, PRE, BUILD]
  core.setOutput('version', version.toString(false))
  core.setOutput(
    'major-minor-patch',
    `${version.major}.${version.minor}.${version.patch}`
  )
  core.setOutput('major-minor', `${version.major}.${version.minor}`)
  core.setOutput('major', version.major)
  core.setOutput('minor', version.minor)
  core.setOutput('patch', version.patch)

  if (version.prerelease) core.setOutput('prerelease', version.prerelease)
  if (version.build) core.setOutput('build', version.build)
}
