import assert from "node:assert/strict";
import test from "node:test";
import {
  MODE_TRACKS,
  STORAGE_KEY,
  isPortfolioMode,
  otherPortfolioMode,
} from "../src/components/experience/experience-config.ts";

test("accepts only supported portfolio modes", () => {
  assert.equal(isPortfolioMode("classic"), true);
  assert.equal(isPortfolioMode("persona"), true);
  assert.equal(isPortfolioMode("dark"), false);
  assert.equal(isPortfolioMode(null), false);
});

test("maps each mode to the other mode and its soundtrack", () => {
  assert.equal(STORAGE_KEY, "ade-portfolio-mode");
  assert.equal(otherPortfolioMode("classic"), "persona");
  assert.equal(otherPortfolioMode("persona"), "classic");
  assert.equal(MODE_TRACKS.classic, "/assets/sounds/classic-background.mp3");
  assert.equal(MODE_TRACKS.persona, "/assets/sounds/persona-background.mp3");
});
