import type { Level } from "../types.ts";

export type Rule = { id: string; re: RegExp; level: Level; msg: string };

// Offline patterns from ToxicSkills, PhantomSkill and injection literature
export const RULES: Rule[] = [
  {
    id: "pipe-shell",
    re: /\b(curl|wget)\b[^\n|]*\|\s*(sudo\s+)?(ba|z)?sh\b/,
    level: "error",
    msg: "remote script piped to shell",
  },
  { id: "base64-blob", re: /[A-Za-z0-9+/]{200,}={0,2}/, level: "warn", msg: "long base64 blob" },
  { id: "eval", re: /\beval\s*\(|\beval\s+["'$]/, level: "warn", msg: "eval of dynamic content" },
  {
    id: "injection",
    re: /ignore (all )?(previous|prior|above) instructions/i,
    level: "error",
    msg: "prompt injection phrase",
  },
  {
    id: "hide",
    re: /do not (tell|mention|reveal|show)( this| it)?( to)? the user|hide (this )?from the user/i,
    level: "error",
    msg: "hidden behavior phrase",
  },
  {
    id: "exfil",
    re: /\b(env|printenv|cat\s+~\/\.(ssh|aws|npmrc|netrc))\b[^\n]*\|\s*(curl|wget|nc)\b/,
    level: "error",
    msg: "secret exfiltration pattern",
  },
  {
    id: "reverse-shell",
    re: /\/dev\/tcp\/|\bnc\s+-e\b|\bncat\s+.*-e\b/,
    level: "error",
    msg: "reverse shell pattern",
  },
];
