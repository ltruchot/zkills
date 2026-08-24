// Expected failure: message for the user, exit code for the shell
export class ZkillsError extends Error {
  public readonly code: number;

  public constructor(message: string, code = 1) {
    super(message);
    this.name = "ZkillsError";
    this.code = code;
  }
}

export function isZkillsError(error: unknown): error is ZkillsError {
  return error instanceof ZkillsError;
}

export const CANCELLED = 130;
