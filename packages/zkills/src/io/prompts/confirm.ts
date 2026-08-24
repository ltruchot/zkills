import * as p from "@clack/prompts";

// Skip prompt with --yes, exit on cancel
export async function confirmOrYes(message: string, yes: boolean): Promise<boolean> {
  if (yes) return true;
  const value = await p.confirm({ message });
  if (p.isCancel(value)) {
    p.cancel("aborted");
    process.exit(130);
  }
  return value;
}
