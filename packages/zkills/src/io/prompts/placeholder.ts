import * as p from "@clack/prompts";
import { validateAnswer } from "../../core/answers/validate.ts";
import type { Placeholder } from "../../core/schema/placeholder.ts";

function cancelled(): never {
  p.cancel("aborted");
  process.exit(130);
}

const validate = (decl: Placeholder) => (v: string | undefined) =>
  validateAnswer(decl, v ?? "") ?? undefined;

// One prompt per placeholder, typed by declaration
export async function askPlaceholder(decl: Placeholder, current?: string): Promise<string> {
  const message = `${decl.name} — ${decl.prompt}`;
  const initial = current ?? decl.default;
  let value: string | boolean | symbol;
  if (decl.type === "enum") {
    const options = (decl.options ?? []).map((o) => ({ value: o, label: o }));
    value = await p.select({ message, options, initialValue: initial });
  } else if (decl.type === "boolean") {
    value = await p.confirm({ message, initialValue: initial === "true" });
  } else if (decl.secret) {
    value = await p.password({ message, validate: validate(decl) });
  } else {
    value = await p.text({
      message,
      initialValue: initial,
      placeholder: decl.default,
      validate: validate(decl),
    });
  }
  if (p.isCancel(value)) cancelled();
  return String(value);
}
