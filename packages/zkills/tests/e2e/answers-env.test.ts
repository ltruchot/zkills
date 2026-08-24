import { expect, test } from "vite-plus/test";
import { cli, project, setBank } from "../helpers/cli.ts";
import { cleanup } from "../helpers/tmp.ts";

test("env answers are validated, orphans reported, bad config explained", async () => {
  const dir = await project("bank-secret");
  expect((await cli(dir, ["init", "-y"])).code).toBe(0);
  const badUrl = await cli(dir, ["add", "vault", "-y"], {
    ZKILLS_ANSWER_VAULT_URL: "nope",
    ZKILLS_ANSWER_TOKEN: "t",
  });
  expect(badUrl.code).toBe(1);
  expect(badUrl.out).toContain("invalid url");
  const badBool = await cli(dir, ["add", "vault", "-y"], {
    ZKILLS_ANSWER_VAULT_URL: "https://v",
    ZKILLS_ANSWER_TOKEN: "t",
    ZKILLS_ANSWER_VERBOSE: "yes",
  });
  expect(badBool.out).toContain("true or false");
  const missing = await cli(dir, ["add", "vault", "-y"], { ZKILLS_ANSWER_VAULT_URL: "https://v" });
  expect(missing.out).toContain("ZKILLS_ANSWER_TOKEN");
  expect(
    (
      await cli(dir, ["add", "vault", "-y"], {
        ZKILLS_ANSWER_VAULT_URL: "https://v",
        ZKILLS_ANSWER_TOKEN: "t",
      })
    ).code,
  ).toBe(0);

  await setBank(dir, "bank-v1");
  const list = await cli(dir, ["list", "--json"]);
  expect(list.out).toContain("orphan, gone from bank");
  const update = await cli(dir, ["update", "vault", "-y"]);
  expect(update.code).toBe(1);
  expect(update.out).toContain("gone from bank");

  await setBank(dir, "nowhere");
  const gone = await cli(dir, ["list"]);
  expect(gone.out).toContain("skip");
  const broken = await cli(dir, ["check"], {});
  expect(broken.code).toBe(0);
  await cleanup(dir);
});
