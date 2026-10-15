import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const personaStyles = readFileSync(
  new URL("../src/components/persona/persona.module.css", import.meta.url),
  "utf8",
);

test("sizes the Persona name against its column instead of the viewport", () => {
  assert.match(personaStyles, /\.homeCopy\s*\{[\s\S]*?container-type:\s*inline-size/);
  assert.match(personaStyles, /\.name\s*\{[\s\S]*?font-size:\s*clamp\([^;]*cqi[^;]*\)/);
});
