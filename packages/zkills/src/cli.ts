#!/usr/bin/env node
import { main } from "./app.ts";

process.exitCode = await main(process.argv);
