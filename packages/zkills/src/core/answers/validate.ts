import type { Placeholder } from "../schema/placeholder.ts";

// Null = valid, string = error message
export function validateAnswer(decl: Placeholder, value: string): string | null {
  if (value.length === 0) return "value required";
  if (value.includes("${CLAUDE_")) return "reserved Claude Code syntax";
  switch (decl.type) {
    case "url":
      return URL.canParse(value) ? null : "invalid url";
    case "boolean":
      return value === "true" || value === "false" ? null : "true or false";
    case "enum":
      return decl.options?.includes(value) ? null : `one of ${decl.options?.join(", ")}`;
    case "path":
      return value.includes("\0") ? "invalid path" : matchPattern(decl, value);
    default:
      return matchPattern(decl, value);
  }
}

function matchPattern(decl: Placeholder, value: string): string | null {
  if (decl.pattern === undefined) return null;
  return new RegExp(decl.pattern).test(value) ? null : `must match ${decl.pattern}`;
}
