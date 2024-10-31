/**
 * Gets the PR comment ID that contains the previous version check comment, if
 * it exists.
 *
 * @returns The ID of the previous version check comment, or undefined
 */
export declare function getCommentId(): Promise<number | undefined>;
/**
 * Comments on the pull request when a version check succeeds or fails.
 *
 * @param success Whether the version check succeeded or failed
 * @param manifestPath The path to the manifest file being checked
 */
export declare function versionCheckComment(success: boolean, manifestPath: string): Promise<void>;
