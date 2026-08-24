import type { CAC } from "cac";
import { register as add } from "./add.ts";
import { register as answers } from "./answers.ts";
import { register as check } from "./check.ts";
import { register as init } from "./init.ts";
import { register as list } from "./list.ts";
import { register as remove } from "./remove.ts";
import { register as update } from "./update.ts";

const COMMANDS = [init, list, add, update, remove, check, answers];

export function registerAll(cli: CAC): void {
  for (const register of COMMANDS) register(cli);
}
