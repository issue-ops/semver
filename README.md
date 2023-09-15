# SemVer Action

[![Check dist/](https://github.com/issue-ops/semver/actions/workflows/check-dist.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/issue-ops/semver/actions/workflows/codeql.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/codeql.yml)
[![Continuous Integration](https://github.com/issue-ops/semver/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/continuous-integration.yml)
[![Super Linter](https://github.com/issue-ops/semver/actions/workflows/super-linter.yml/badge.svg)](https://github.com/issue-ops/semver/actions/workflows/super-linter.yml)
[![Code Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Gets the [Semantic Version](https://semver.org/) of a repository based on the
type of manifest file located. This action currently supports the following:

| Language | Manifest File    |
| -------- | ---------------- |
| Node.js  | `package.json`   |
| Python   | `pyproject.toml` |
| Python   | `setup.cfg`      |
| Python   | `setup.py`       |
| Java     | `pom.xml`        |

> **Note**
>
> This action currently only supports repositories where the manifest file is
> located at the **root** of the repository.

Once a version has been located, this action automatically creates or updates
the following tags to point to the specified `ref`, depending on if this is a
prerelease version or not.

| Prerelease | Tag                                     |
| ---------- | --------------------------------------- |
| Yes        | `v<major>.<minor>.<patch>-<prerelease>` |
| No         | `v<major>.<minor>.<patch>`              |
|            | `v<major>.<minor>`                      |
|            | `v<major>`                              |

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
      # Checkout the repository with fetch-depth set to 0 (get all tags)
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Tag Commit
        id: tag-commit
        uses: issue-ops/semver@vX.X.X
        with:
          workspace: ${{ github.workspace }}
          ref: main

      - name: Print version
        run: echo ${{ steps.tag-commit.outputs.version }}
```

## Inputs

| Input       | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `ref`       | The Git ref to tag                                           |
|             | Defaults to `${{ github.base_ref }}`                         |
| `version`   | A specific version to parse and return                       |
| `workspace` | The workspace where the repository was checked out           |
|             | Defaults to `${{ github.workspace }}` for `actions/checkout` |

> [!NOTE]
>
> Only `version` or `workspace` should be provided, not both!

## Outputs

The action outputs the following (assuming the version in the manifest file is
`1.2.3-alpha.4`):

| Output              | Description                          | Example         |
| ------------------- | ------------------------------------ | --------------- |
| `version`           | The full semantic version            | `1.2.3-alpha.4` |
| `major-minor-patch` | The major, minor, and patch versions | `1.2.3`         |
| `major-minor`       | The major and minor versions         | `1.2`           |
| `major`             | The major version                    | `1`             |
| `minor`             | The minor version                    | `2`             |
| `patch`             | The patch version                    | `3`             |
| `prerelease`        | The prerelease version               | `alpha.4`       |

## Example

If a repository has the following tag and commit structure:

```plain
9807987 (HEAD)                    // Latest commit, no tags
0123456 (tags: v2.1.0, v2.1, v2)  // Latest for v2.x.x (major) / v2.1.x (minor)
1243415 (tags: v2.0.0, v2.0)      // Latest for v2.0.x (minor)
9517391 (tags: v1.2.3, v1.2, v1)  // Latest for v1.x.x (major) / v1.2.x (minor)
...
```

If the action is run with `version` set to `2.3.1` in `package.json`, the
repository tags will be updated to:

```plain
9807987 (tags: v2.3.1, v2.3, v2)  // v2 tag moved, v2.3 / v2.3.1 tags created
0123456 (tags: v2.1.0, v2.1)
1243415 (tags: v2.0.0)
9517391 (tags: v1.2.3, v1.2, v1)
...
```
