import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

test("requireAudit blocks flagged skills on add, allows clean ones", async () => {
  const dir = await project("bank-bad");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  await setBank(dir, "bank-bad", { policy: { requireAudit: true } });
  const blocked = await cli(dir, ["add", "curl-sh", "-y"]);
  expect(blocked.code).toBe(1);
  expect(blocked.out).toContain("audit failed");
  expect(blocked.out).toContain("pipe-shell");
  await setBank(dir, "bank-bad");
  expect((await cli(dir, ["add", "curl-sh", "-y"])).code).toBe(0);
  await setBank(dir, "bank-v1", { policy: { requireAudit: true } });
  expect(
    (await cli(dir, ["add", "hello", "-y"], { ZKILLS_ANSWER_PROJECT_NAME: "Acme" })).code,
  ).toBe(0);
  await cleanup(dir);
});
