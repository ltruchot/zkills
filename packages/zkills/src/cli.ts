#!/usr/bin/env node
import { cac } from "cac";
import { VERSION } from "./version.ts";

const cli = cac("zkills");

cli.help();
cli.version(VERSION);
cli.parse();
