import { resolve } from "node:path";
import { hashTree } from "../core/hash/tree.ts";
import { exists, readTree } from "./fs.ts";

export type Resolved = { dir: string; sha: string };

// Local bank: sha = "local:" + tree hash of the bank path
export async function fetchLocal(repo: string, path: string, root: string): Promise<Resolved> {
  const dir = resolve(root, repo, path);
  if (!(await exists(dir))) throw new Error(`local bank not found: ${dir}`);
  const tree = hashTree(await readTree(dir));
  return { dir, sha: `local:${tree.tree}` };
}
