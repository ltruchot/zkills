import type { CAC } from "cac";
import { register as add } from "./add.ts";
import { register as check } from "./check.ts";
import { register as init } from "./init.ts";
import { register as list } from "./list.ts";
import { register as remove } from "./remove.ts";

const COMMANDS = [init, list, add, remove, check];

export function registerAll(cli: CAC): void {
  for (const register of COMMANDS) register(cli);
}
