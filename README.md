# SemVer Action

[![Check dist/](https://github.com/issue-ops/semver/actions/workflows/check-dist.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/issue-ops/semver/actions/workflows/codeql.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/codeql.yml)
[![Continuous Integration](https://github.com/issue-ops/semver/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/continuous-integration.yml)
[![Continuous Delivery](https://github.com/issue-ops/semver/actions/workflows/continuous-delivery.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/continuous-delivery.yml)
[![Linter](https://github.com/issue-ops/semver/actions/workflows/linter.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/linter.yml)
[![Code Coverage](./badges/coverage.svg)](./badges/coverage.svg)

> [!IMPORTANT]
>
> As of version `v2.0.0`, this action has been converted to ESM.

Gets the [Semantic Version](https://semver.org/) of a repository based on the
type of manifest file located. This action currently supports the following:

| Language                   | Manifest File    |
| -------------------------- | ---------------- |
| Dart                       | `pubspec.yaml`   |
| GitHub Actions (Container) | `action.yml`     |
| Java                       | `pom.xml`        |
| Node.js                    | `package.json`   |
| Python                     | `pyproject.toml` |
|                            | `setup.cfg`      |
|                            | `setup.py`       |
| _Other_                    | `.version`       |

> [!TIP]
>
> If your project type/language is not available, you can create a generic
> `.version` file in your repository and refer to that! The `.version` file
> should only contain the version information.

Once a version has been located, this action automatically creates or updates
the following tags to point to the specified `ref`, depending on if this is a
prerelease version or not.

| Prerelease | Tag                                             |
| ---------- | ----------------------------------------------- |
| Yes        | `v<major>.<minor>.<patch>-<prerelease>+<build>` |
|            | `v<major>.<minor>.<patch>-<prerelease>`         |
| No         | `v<major>.<minor>.<patch>+<build>`              |
|            | `v<major>.<minor>.<patch>`                      |
|            | `v<major>.<minor>`                              |
|            | `v<major>`                                      |

> [!NOTE]
>
> Build tags are only created if build metadata is provided/inferred from the
> version string.

## Setup

Here is a simple example of how to use this action in your workflow. Make sure
to replace `vX.X.X` with the latest version of this action.

```yml
name: Continuous Delivery

on:
  pull_request:
    types:
      - closed
    branches:
      - main

# This is required to be able to update tags
permissions:
  contents: write

jobs:
  release:
    name: Release Version
    runs-on: ubuntu-latest

    # Only run this job if the PR was merged
    if: ${{ github.event.pull_request.merged == true }}

    steps:
      # Checkout the repository with fetch-tags set to true
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4
        with:
          fetch-tags: true

      - name: Tag Commit
        id: tag-commit
        uses: issue-ops/semver@vX.X.X
        with:
          manifest-path: package.json
          workspace: ${{ github.workspace }}
          ref: main

      - name: Print version
        run: echo ${{ steps.tag-commit.outputs.version }}
```

## Inputs

| Input              | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `allow-prerelease` | If `check-only` is `'true'`, this controls if the      |
|                    | check should pass if a matching prerelease version is  |
|                    | detected (e.g. `v1.0.0-SNAPSHOT`)                      |
|                    | Default: `'true'`                                      |
| `check-only`       | If set to `'true'`, only checks if the version exists. |
|                    | Fails the action if the version already exists.        |
|                    | Default: `'false'`                                     |
| `manifest-path`    | The path to the manifest that contains the version.    |
|                    | Relative to the root of the repository.                |
|                    | If not set, `use-version` must be set.                 |
| `overwrite`        | Set to `'true'` to overwrite existing tags.            |
|                    | Default: `'false'`                                     |
| `push-tags`        | Set to `'true'` to push tags to the repository.        |
|                    | Default: `'true'`                                      |
| `ref`              | The Git ref to tag.                                    |
|                    | Defaults to the base ref of a pull request trigger.    |
| `use-version`      | The version you want to explicitly use.                |
|                    | This must follow SemVer 2.0 standards.                 |
|                    | If not set, `manifest-path` must be set.               |
| `workspace`        | The path where the repository has been cloned.         |
|                    | Default: `${{ github.workspace }}`                     |

## Outputs

The action outputs the following (assuming the version in the manifest file is
`1.2.3-alpha.4+build.5`):

| Output              | Description               | Example                 |
| ------------------- | ------------------------- | ----------------------- |
| `version`           | Full Semantic Version     | `1.2.3-alpha.4+build.5` |
| `major-minor-patch` | `<major>.<minor>.<patch>` | `1.2.3`                 |
| `major-minor`       | `<major>.<minor>`         | `1.2`                   |
| `major`             | `<major>`                 | `1`                     |
| `minor`             | `<minor>`                 | `2`                     |
| `patch`             | `<patch>`                 | `3`                     |
| `prerelease`        | `<prerelease>`            | `alpha.4`               |
| `build`             | `<build>`                 | `build.5`               |

If the prerelease and/or build versions are not provided, they will not be
included in the full `version` output.

## Errors

If the `overwrite` parameter is `'false'` (the default value), this action will
fail if there is an existing version tag in the repository that matches the
inferred or provided version. This is to prevent releases from overwriting one
another. However, this only applies to the full `version` output. Other tags,
such as `<major>.<minor>` are ignored in this check.

## Example

Assume a Node.js repository has the following tag and commit structure:

| Commit    | Tags                   | Notes                                |
| --------- | ---------------------- | ------------------------------------ |
| `9807987` |                        | Latest commit, no tags               |
| `0123456` | `v2.1.0`, `v2.1`, `v2` | Latest `v2` (major) / `v2.1` (minor) |
| `1243415` | `v2.0.0`, `v2.0`       | Latest `v2.0` (minor)                |
| `9517391` | `v1.2.3`, `v1.2`, `v1` | Latest `v1` (major) / `v1.2` (minor) |

### Prerelease Update

If the action is run with `version` set to `2.3.1-alpha.1` in `package.json`,
the repository tags will be updated to:

| Commit    | Tags                   | Notes                                |
| --------- | ---------------------- | ------------------------------------ |
| `9807987` | `v2.3.1-alpha.1`       | Latest commit, with prerelease tag   |
| `0123456` | `v2.1.0`, `v2.1`, `v2` | Latest `v2` (major) / `v2.1` (minor) |
| `1243415` | `v2.0.0`, `v2.0`       | Latest `v2.0` (minor)                |
| `9517391` | `v1.2.3`, `v1.2`, `v1` | Latest `v1` (major) / `v1.2` (minor) |

> [!WARNING]
>
> In prerelease updates, existing major/minor/patch tags **are not** modified.

## Major/Minor/Patch Update

If the action is run with `version` set to `2.1.3` in `package.json`, the
repository tags will be updated to:

| Commit    | Tags                   | Notes                                |
| --------- | ---------------------- | ------------------------------------ |
| `9807987` | `v2.1.3`, `v2.1`, `v2` | Latest commit, no tags               |
| `0123456` | `v2.1.0`               | Latest `v2` (major) / `v2.1` (minor) |
| `1243415` | `v2.0.0`, `v2.0`       | Latest `v2.0` (minor)                |
| `9517391` | `v1.2.3`, `v1.2`, `v1` | Latest `v1` (major) / `v1.2` (minor) |

> [!WARNING]
>
> In major/minor/patch updates, existing major/minor/patch tags **are**
> modified.
