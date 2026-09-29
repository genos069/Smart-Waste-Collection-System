import { test } from "node:test";
import assert from "node:assert/strict";
import { passwordError } from "../src/utils/validation.js";

test("password validation matches backend character and UTF-8 byte limits", () => {
  assert.ok(passwordError("short"));
  assert.equal(passwordError("12345678"), "");
  assert.equal(passwordError("a".repeat(72)), "");
  assert.ok(passwordError("a".repeat(73)));
  assert.equal(passwordError("🔐".repeat(18)), "");
  assert.ok(passwordError("🔐".repeat(19)));
});
