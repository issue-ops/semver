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
    core.setFailed('Either workspace or version must be defined')
    return
  }

  core.info(`Ref: ${ref}`)
  core.info(`Workspace: ${workspace}`)
  core.info(`Input Version: ${versionInput}`)

  // Get version from input, or infer it from the workspace
  const version: Version | undefined = versionInput
    ? new Version(versionInput)
    : Version.infer(workspace)

  if (version === undefined) {
    core.setFailed('Could not infer version')
    return
  }

  core.info(`Inferred Version: ${version.toString()}`)

  // TODO: Set the verison tags

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
