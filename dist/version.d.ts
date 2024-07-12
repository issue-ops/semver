/**
 * A parsed, SemVer-compliant version, along with parsing and tagging utilities
 */
export declare class Version {
    /** Major Version */
    major: string | number;
    /** Minor Version */
    minor: string | number;
    /** Patch Version */
    patch: string | number;
    /** Prerelease Version */
    prerelease?: string | number;
    /** Build Metadata */
    build?: string | number;
    /**
     * Create a new Version instance from a version string
     *
     * @param version A (hopefully) SemVer-compliant version string
     */
    constructor(version: string);
    /**
     * Print the version as a string
     *
     * @param prefix True to include the 'v' prefix (e.g. 'v1.2.3')
     * @returns The version as a string
     */
    toString(prefix?: boolean): string;
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
    static infer(manifestPath: string, workspace: string): Version | undefined;
    /**
     * Tag the ref with the inferred version tags
     *
     * @param ref The ref to tag
     * @param workspace The project workspace
     */
    tag(ref: string, workspace: string): Promise<void>;
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
    exists(workspace: string, allowPrerelease: boolean): Promise<boolean>;
}
