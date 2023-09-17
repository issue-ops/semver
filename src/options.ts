import { ExecOptions } from '@actions/exec'

/**
 * TagOptions is a wrapper around ExecOptions that provides
 * a way to capture stdout and stderr (for testing/mocking)
 */
export class TagOptions {
  stdout: string = ''
  stderr: string = ''
  options: ExecOptions

  constructor(workspace: string) {
    this.options = {
      listeners: {
        stdout: (data: Buffer) => {
          this.stdout += data.toString()
        },
        stderr: (data: Buffer) => {
          this.stderr += data.toString()
        }
      },
      cwd: workspace,
      silent: true
    }
  }

  /**
   * Resets stdout and stderr
   */
  reset() {
    this.stdout = ''
    this.stderr = ''
  }
}
