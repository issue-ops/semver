import { ExecOptions } from '@actions/exec';
/**
 * TagOptions is a wrapper around ExecOptions that provides
 * a way to capture stdout and stderr (for testing/mocking)
 */
export declare class TagOptions {
    stdout: string;
    stderr: string;
    options: ExecOptions;
    constructor(workspace: string);
    /**
     * Resets stdout and stderr
     */
    reset(): void;
}
