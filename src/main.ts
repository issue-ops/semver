import * as core from '@actions/core'
import { Version } from './version'

export async function run() {
  const ref = core.getInput('ref')
  const workspace = core.getInput('workspace')
  const versionInput = core.getInput('version')

  if (
    (workspace === '' && versionInput === '') ||
    (workspace !== '' && versionInput !== '')
  ) {
    core.setFailed('Must provide workspace OR version')
    return
  }

  core.info(`Ref: ${ref}`)
  if (workspace !== '') core.info(`Workspace: ${workspace}`)
  if (versionInput !== '') core.info(`Version Input: ${versionInput}`)

  // Get version from input string, or infer it from the workspace
  const version: Version | undefined = versionInput
    ? new Version(versionInput)
    : Version.infer(workspace)

  if (version === undefined) {
    core.setFailed('Could not infer version')
    return
  }

  core.info(`Inferred Version: ${version.toString()}`)

  // Tag and push the version in the workspace
  await version.tag(ref, workspace)

  // Output the various version formats
  // [X.Y.Z-PRE, X.Y.Z, X.Y, X, Y, Z, PRE]
  core.setOutput('version', version.toString(false))
  core.setOutput(
    'major-minor-patch',
    `${version.major}.${version.minor}.${version.patch}`
  )
  core.setOutput('major-minor', `${version.major}.${version.minor}`)
  core.setOutput('major', version.major)
  core.setOutput('minor', version.minor)
  core.setOutput('patch', version.patch)
  core.setOutput('prerelease', version.prerelease)
}
