# Persona Entry Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 680 ms Persona-style diagonal wipe when a visitor selects Persona Mode, switching the rendered experience at the covered midpoint while starting audio from the click.

**Architecture:** Keep transition orchestration in `ExperienceShell`, where mode, chooser, and audio state already live. Put deterministic timing selection in `experience-config.ts` for unit testing, and isolate the decorative GPU-friendly animation in an experience CSS module without adding dependencies.

**Tech Stack:** React 19, Next.js 16, TypeScript, CSS Modules, Motion `useReducedMotion`, Node test runner

## Global Constraints

- The normal transition lasts exactly 680 ms and mounts Persona Mode at 330 ms.
- Reduced motion switches immediately and uses a 160 ms opacity fade without diagonal movement.
- Audio playback starts directly from the selection click and audio failure never blocks mode selection.
- Classic Mode keeps the existing immediate behavior.
- Repeated selection is ignored while the Persona entry transition is active.
- Animate only `transform` and `opacity`; add no dependency.

---

### Task 1: Define and test the transition timing contract

**Files:**
- Modify: `src/components/experience/experience-config.ts`
- Modify: `tests/experience-config.test.ts`

**Interfaces:**
- Produces: `ModeTransitionTiming` with `switchDelay` and `finishDelay` numbers.
- Produces: `getModeTransitionTiming(mode: PortfolioMode, reducedMotion: boolean): ModeTransitionTiming | null`.
- Consumed by: Task 2 `ExperienceShell.selectMode`.

- [ ] **Step 1: Write the failing timing tests**

Add these imports and assertions to `tests/experience-config.test.ts`:

```ts
import {
  MODE_TRACKS,
  STORAGE_KEY,
  getModeTransitionTiming,
  isPortfolioMode,
  otherPortfolioMode,
} from "../src/components/experience/experience-config.ts";

test("defines Persona entry timing without delaying Classic Mode", () => {
  assert.deepEqual(getModeTransitionTiming("persona", false), {
    switchDelay: 330,
    finishDelay: 680,
  });
  assert.deepEqual(getModeTransitionTiming("persona", true), {
    switchDelay: 0,
    finishDelay: 160,
  });
  assert.equal(getModeTransitionTiming("classic", false), null);
});
```

- [ ] **Step 2: Run the test and verify the red state**

Run: `rtk pnpm test`

Expected: FAIL because `getModeTransitionTiming` is not exported.

- [ ] **Step 3: Add the minimal timing implementation**

Append to `src/components/experience/experience-config.ts`:

```ts
export type ModeTransitionTiming = {
  switchDelay: number;
  finishDelay: number;
};

const PERSONA_ENTRY_TIMING: Record<"default" | "reduced", ModeTransitionTiming> = {
  default: { switchDelay: 330, finishDelay: 680 },
  reduced: { switchDelay: 0, finishDelay: 160 },
};

export function getModeTransitionTiming(
  mode: PortfolioMode,
  reducedMotion: boolean,
): ModeTransitionTiming | null {
  if (mode !== "persona") return null;
  return PERSONA_ENTRY_TIMING[reducedMotion ? "reduced" : "default"];
}
```

- [ ] **Step 4: Run the tests and verify green**

Run: `rtk pnpm test`

Expected: all tests PASS.

- [ ] **Step 5: Commit the timing contract**

```bash
rtk git add src/components/experience/experience-config.ts tests/experience-config.test.ts
rtk git commit -m "test: define Persona entry timing"
```

### Task 2: Orchestrate the wipe and integrate reduced motion

**Files:**
- Create: `src/components/experience/persona-entry-transition.module.css`
- Modify: `src/components/experience/experience-shell.tsx`
- Create: `tests/persona-entry-transition.test.ts`

**Interfaces:**
- Consumes: `getModeTransitionTiming(mode, reducedMotion)` from Task 1.
- Produces: a fixed decorative overlay rendered while `personaEntryActive` is true.
- Preserves: `ExperienceChooser.onSelect(mode)` and the existing audio control API.

- [ ] **Step 1: Write the failing integration contract test**

Create `tests/persona-entry-transition.test.ts`:

```ts
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
  assert.match(shellSource, /aria-hidden="true"/);
});

test("Persona entry styles provide diagonal and reduced-motion paths", () => {
  assert.equal(existsSync(stylesUrl), true);
  const styles = readFileSync(stylesUrl, "utf8");
  assert.match(styles, /animation-delay:\s*40ms/);
  assert.match(styles, /animation-delay:\s*80ms/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run the test and verify the red state**

Run: `rtk pnpm test`

Expected: FAIL because the shell does not use the timing helper and the CSS module does not exist.

- [ ] **Step 3: Add the CSS module**

Create `src/components/experience/persona-entry-transition.module.css`:

```css
.overlay {
  pointer-events: auto;
  position: fixed;
  inset: -12%;
  z-index: 2147483647;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  transform: translateX(-130%) skewX(-14deg);
  animation: persona-entry-wipe 600ms cubic-bezier(.77, 0, .175, 1) forwards;
}

.paper { background: #f4f1e9; }
.ink { background: #090a0f; animation-delay: 40ms; }
.blue { background: #08a9e6; animation-delay: 80ms; }

@keyframes persona-entry-wipe {
  0% { transform: translateX(-130%) skewX(-14deg); }
  40%, 55% { transform: translateX(0) skewX(-14deg); }
  100% { transform: translateX(130%) skewX(-14deg); }
}

@media (prefers-reduced-motion: reduce) {
  .overlay {
    inset: 0;
    background: #06080d;
    animation: persona-entry-fade 160ms cubic-bezier(.23, 1, .32, 1) forwards;
  }

  .layer { display: none; }
}

@keyframes persona-entry-fade {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

- [ ] **Step 4: Integrate state, timers, audio ordering, and overlay markup**

In `src/components/experience/experience-shell.tsx`:

Import `useReducedMotion` from `motion/react`, import the CSS module as `transitionStyles`, and add `getModeTransitionTiming` to the existing config import. Add this state and cleanup beside the existing refs and effects:

```ts
const shouldReduceMotion = useReducedMotion();
const [personaEntryActive, setPersonaEntryActive] = useState(false);
const transitionTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

useEffect(() => () => {
  transitionTimers.current.forEach(clearTimeout);
}, []);
```

Replace the existing `selectMode` function with these local functions:

```ts
function applyMode(nextMode: PortfolioMode) {
  window.localStorage.setItem(STORAGE_KEY, nextMode);
  setMode(nextMode);
  setChooserOpen(false);
}

function startAudio(nextMode: PortfolioMode) {
  const audio = audioRef.current;
  if (!audio) return;
  audio.pause();
  audio.src = MODE_TRACKS[nextMode];
  audio.currentTime = 0;
  audio.volume = 0.24;
  audio.loop = true;
  setAudioUnavailable(false);
  void audio
    .play()
    .then(() => setAudioPlaying(true))
    .catch(() => setAudioPlaying(false));
}

function selectMode(nextMode: PortfolioMode) {
  if (personaEntryActive) return;
  startAudio(nextMode);

  const timing = getModeTransitionTiming(nextMode, shouldReduceMotion === true);
  if (!timing) {
    applyMode(nextMode);
    return;
  }

  setPersonaEntryActive(true);
  transitionTimers.current.push(
    setTimeout(() => applyMode(nextMode), timing.switchDelay),
    setTimeout(() => setPersonaEntryActive(false), timing.finishDelay),
  );
}
```

Render this overlay immediately after the portfolio content:

```tsx
{personaEntryActive && (
  <div className={transitionStyles.overlay} aria-hidden="true">
    <span className={`${transitionStyles.layer} ${transitionStyles.paper}`} />
    <span className={`${transitionStyles.layer} ${transitionStyles.ink}`} />
    <span className={`${transitionStyles.layer} ${transitionStyles.blue}`} />
  </div>
)}
```

Keep `startAudio` and `applyMode` as local functions because they are used only by this component.

- [ ] **Step 5: Run automated verification**

Run:

```bash
rtk pnpm test
rtk pnpm exec tsc --noEmit
rtk pnpm build
rtk git diff --check
```

Expected: all tests PASS, TypeScript exits 0, the production build completes, and diff-check prints no errors.

- [ ] **Step 6: Verify behavior in the browser**

Run `rtk pnpm dev`, clear `ade-portfolio-mode` from local storage, and inspect these paths:

- Desktop `1440×900`: initial chooser → Persona; confirm three diagonal layers, no chooser/Persona overlap, music starts, and Persona is interactive after 680 ms.
- Desktop `1440×900`: Classic → Switch Experience → Persona; confirm the same transition.
- Mobile `390×844`: confirm full viewport coverage and no horizontal overflow.
- Reduced motion: emulate `prefers-reduced-motion: reduce`; confirm a 160 ms fade with no diagonal sweep.

- [ ] **Step 7: Commit the implementation**

```bash
rtk git add src/components/experience/experience-shell.tsx src/components/experience/persona-entry-transition.module.css tests/persona-entry-transition.test.ts
rtk git commit -m "feat: add Persona entry transition"
```
