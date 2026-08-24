import * as p from "@clack/prompts";

export async function selectSkills(names: string[], message = "Pick skills"): Promise<string[]> {
  const value = await p.multiselect({
    message,
    options: names.map((n) => ({ value: n, label: n })),
  });
  if (p.isCancel(value)) {
    p.cancel("aborted");
    process.exit(130);
  }
  return value;
}
