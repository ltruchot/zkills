// Agent Skills open spec
export const PORTABLE_KEYS = [
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
];

// Claude Code extensions on top of the spec
const CLAUDE_ONLY = [
  "when_to_use",
  "argument-hint",
  "arguments",
  "disable-model-invocation",
  "user-invocable",
  "disallowed-tools",
  "model",
  "effort",
  "context",
  "agent",
  "background",
  "hooks",
  "paths",
  "shell",
];

export const CLAUDE_KEYS = [...PORTABLE_KEYS, ...CLAUDE_ONLY];
