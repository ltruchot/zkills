import * as p from "@clack/prompts";
import pc from "picocolors";

export const intro = (title: string): void => p.intro(pc.bgCyan(pc.black(` ${title} `)));
export const outro = (msg: string): void => p.outro(msg);
export const info = (msg: string): void => p.log.info(msg);
export const warn = (msg: string): void => p.log.warn(pc.yellow(msg));
export const success = (msg: string): void => p.log.success(msg);
export const step = (msg: string): void => p.log.step(msg);
export const note = (lines: string[], title?: string): void => p.note(lines.join("\n"), title);

export function fail(msg: string): never {
  p.log.error(pc.red(msg));
  process.exit(1);
}

export async function spin<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const s = p.spinner();
  s.start(label);
  try {
    const result = await fn();
    s.stop(label);
    return result;
  } catch (error) {
    s.stop(pc.red(label));
    throw error;
  }
}

export function print(lines: string[]): void {
  for (const line of lines) console.log(line);
}
