import { execa } from "execa";

export const EXTERNAL_WARNING = [
  "external skills come from skills.sh, not from your org bank",
  "review them manually or with a sandboxed agent before trust",
  "npx skills sends telemetry unless DISABLE_TELEMETRY=1",
];

// Delegate to npx skills update, returns exit code
export async function runExternalUpdate(cwd: string): Promise<number> {
  const result = await execa("npx", ["skills", "update", "-y"], {
    cwd,
    stdio: "inherit",
    reject: false,
  });
  return result.exitCode ?? 1;
}
