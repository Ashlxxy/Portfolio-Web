import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const shellSource = readFileSync(
  new URL("../src/components/experience/experience-shell.tsx", import.meta.url),
  "utf8",
);
const stylesUrl = new URL(
  "../src/components/experience/persona-entry-transition.module.css",
  import.meta.url,
);

test("ExperienceShell owns the Persona entry transition", () => {
  assert.match(shellSource, /getModeTransitionTiming/);
  assert.match(shellSource, /personaEntryActive/);
  assert.match(shellSource, /transitionStyles\.overlay/);
});

test("Persona entry styles provide diagonal and reduced-motion paths", () => {
  assert.equal(existsSync(stylesUrl), true);
  const styles = readFileSync(stylesUrl, "utf8");
  assert.match(styles, /animation-delay:\s*40ms/);
  assert.match(styles, /animation-delay:\s*80ms/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
