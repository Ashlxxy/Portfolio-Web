# Dual-Theme Persona Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a remembered Classic/Persona entry choice whose click starts theme-specific background music, plus a native Persona-style presentation of the existing portfolio content.

**Architecture:** A client-side `ExperienceShell` owns the selected portfolio mode, first-visit chooser, and one shared audio element. The existing portfolio remains the Classic child tree, while a scoped `PersonaPortfolio` component renders the same data in a fixed-screen game-menu presentation without leaking CSS into Classic pages.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Tailwind CSS, Motion, Lucide React, Node's built-in test runner.

## Global Constraints

- All public-facing copy remains in English.
- Do not add a third-party dependency.
- Show the chooser only when no valid stored mode exists; retain a visible way to reopen it.
- Use `localStorage` key `ade-portfolio-mode` with only `classic` and `persona` as valid values.
- Start audio only from a click or keyboard confirmation and never play both tracks together.
- Classic uses `/assets/sounds/classic-background.mp3`; Persona uses `/assets/sounds/persona-background.mp3`.
- Persona content must come from Ade's existing `config`, `projects`, resume constants, profile photo, and CV.
- Persona-specific fixed layout and styling must not affect Classic or blog routes.
- Respect `prefers-reduced-motion` and preserve keyboard navigation and visible focus.

---

### Task 1: Typed Experience Configuration

**Files:**
- Create: `src/components/experience/experience-config.ts`
- Create: `tests/experience-config.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `PortfolioMode`, `STORAGE_KEY`, `MODE_TRACKS`, `isPortfolioMode(value)`, and `otherPortfolioMode(mode)`.
- Consumed by: `ExperienceShell` and its tests.

- [ ] **Step 1: Add the built-in test command**

Add to `package.json` scripts:

```json
"test": "node --experimental-strip-types --test tests/**/*.test.ts"
```

- [ ] **Step 2: Write the failing tests**

Create `tests/experience-config.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the tests and confirm the expected failure**

Run: `rtk pnpm test`

Expected: FAIL because `experience-config.ts` does not exist.

- [ ] **Step 4: Implement the minimal typed configuration**

Create `src/components/experience/experience-config.ts`:

```ts
export const PORTFOLIO_MODES = ["classic", "persona"] as const;

export type PortfolioMode = (typeof PORTFOLIO_MODES)[number];

export const STORAGE_KEY = "ade-portfolio-mode";

export const MODE_TRACKS: Record<PortfolioMode, string> = {
  classic: "/assets/sounds/classic-background.mp3",
  persona: "/assets/sounds/persona-background.mp3",
};

export function isPortfolioMode(value: unknown): value is PortfolioMode {
  return PORTFOLIO_MODES.includes(value as PortfolioMode);
}

export function otherPortfolioMode(mode: PortfolioMode): PortfolioMode {
  return mode === "classic" ? "persona" : "classic";
}
```

- [ ] **Step 5: Run the tests and typecheck**

Run: `rtk pnpm test`

Expected: 2 tests pass.

Run: `rtk pnpm exec tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 6: Commit**

```powershell
rtk git add package.json src/components/experience/experience-config.ts tests/experience-config.test.ts
rtk git commit -m "test: define portfolio experience modes"
```

### Task 2: Theme Audio and Persona Artwork Assets

**Files:**
- Create: `public/assets/sounds/classic-background.mp3`
- Create: `public/assets/sounds/persona-background.mp3`
- Create: `public/assets/persona/home.jpg`
- Create: `public/assets/persona/skills.jpg`
- Create: `public/assets/persona/about.jpg`
- Create: `public/assets/persona/contact.jpg`

**Interfaces:**
- Produces: stable public URLs referenced by `MODE_TRACKS` and Persona CSS.
- Consumes: the two user-provided MP3 files and the four supplied Persona template backgrounds.

- [ ] **Step 1: Copy the exact supplied files to stable public paths**

Run:

```powershell
rtk powershell -NoProfile -Command "New-Item -ItemType Directory -Force -Path 'public/assets/persona' | Out-Null; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\5 Minute Countdown Timer - Cozy Coffee Shop With Fireplace & Music (Jazz).mp3' -Destination 'public/assets/sounds/classic-background.mp3'; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\Persona 3 Reload - Color Your Night (with Lyrics).mp3' -Destination 'public/assets/sounds/persona-background.mp3'; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\Persona_style_portfolio-main\Persona_style_portfolio-main\assets\menus\home.jpg' -Destination 'public/assets/persona/home.jpg'; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\Persona_style_portfolio-main\Persona_style_portfolio-main\assets\menus\skills.jpg' -Destination 'public/assets/persona/skills.jpg'; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\Persona_style_portfolio-main\Persona_style_portfolio-main\assets\menus\about.jpg' -Destination 'public/assets/persona/about.jpg'; Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\Persona_style_portfolio-main\Persona_style_portfolio-main\assets\menus\contact.jpg' -Destination 'public/assets/persona/contact.jpg'"
```

- [ ] **Step 2: Verify names and non-zero sizes**

Run:

```powershell
rtk powershell -NoProfile -Command "Get-Item 'public/assets/sounds/classic-background.mp3','public/assets/sounds/persona-background.mp3','public/assets/persona/*.jpg' | Select-Object Name,Length"
```

Expected: six files, each with a size greater than zero.

- [ ] **Step 3: Commit**

```powershell
rtk git add public/assets/sounds/classic-background.mp3 public/assets/sounds/persona-background.mp3 public/assets/persona
rtk git commit -m "assets: add portfolio experience media"
```

### Task 3: First-Visit Chooser and Shared Audio Shell

**Files:**
- Create: `src/components/experience/experience-shell.tsx`
- Create: `src/components/experience/experience-chooser.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- `ExperienceShell({ children }: { children: React.ReactNode })` renders Classic chrome/children or Persona mode on `/`, and leaves all non-home routes in Classic mode.
- `ExperienceChooser({ currentMode, onSelect, onClose })` calls `onSelect(mode)` directly from the visitor gesture.
- Consumes: `MODE_TRACKS`, `STORAGE_KEY`, `isPortfolioMode`, `otherPortfolioMode`, `PersonaPortfolio`.

- [ ] **Step 1: Create the chooser component**

Implement two semantic mode buttons inside a fixed, labelled dialog-like region. Use a split layout, English labels, focus rings, `aria-label="Choose portfolio experience"`, and these exact descriptions:

```tsx
const choices = {
  classic: {
    label: "Classic Mode",
    description: "A modern scrolling portfolio with interactive 3D details.",
  },
  persona: {
    label: "Persona Mode",
    description: "A bold game-menu experience built around the same work.",
  },
} satisfies Record<PortfolioMode, { label: string; description: string }>;
```

Render `onClose` only when `currentMode` is non-null, so first-time visitors must choose but returning visitors can cancel a mode change.

- [ ] **Step 2: Create the shell with persisted state and one audio element**

Implement these state transitions in `experience-shell.tsx`:

```tsx
const [mode, setMode] = useState<PortfolioMode | null>(null);
const [ready, setReady] = useState(false);
const [chooserOpen, setChooserOpen] = useState(false);
const [audioPlaying, setAudioPlaying] = useState(false);
const [audioUnavailable, setAudioUnavailable] = useState(false);
const audioRef = useRef<HTMLAudioElement>(null);

useEffect(() => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  setMode(isPortfolioMode(stored) ? stored : null);
  setChooserOpen(!isPortfolioMode(stored));
  setReady(true);
}, []);
```

Selection must update storage and begin playback in the same event handler:

```tsx
function selectMode(nextMode: PortfolioMode) {
  window.localStorage.setItem(STORAGE_KEY, nextMode);
  setMode(nextMode);
  setChooserOpen(false);
  const audio = audioRef.current;
  if (!audio) return;
  audio.pause();
  audio.src = MODE_TRACKS[nextMode];
  audio.currentTime = 0;
  audio.volume = 0.24;
  audio.loop = true;
  setAudioUnavailable(false);
  void audio.play().then(() => setAudioPlaying(true)).catch(() => setAudioPlaying(false));
}
```

On hydration of a stored mode, assign its `src` but do not autoplay. The audio control must call `play()`/`pause()`, expose `aria-pressed`, and show text in addition to the icon. Attach `onError={() => { setAudioPlaying(false); setAudioUnavailable(true); }}` to the audio element.

For `/`:

- render a neutral full-viewport hold screen until `ready`;
- render Classic chrome plus `children` when `mode === "classic"`;
- render `<PersonaPortfolio />` when `mode === "persona"`;
- render the chooser whenever `chooserOpen` is true;
- render a fixed control group with **Switch Experience** and **Pause Music**/**Play Music** after a mode exists.

For non-home paths, render Classic chrome and children without chooser/audio controls.

- [ ] **Step 3: Move page chrome ownership from the server layout to the shell**

In `src/app/layout.tsx`, replace direct `Header`, `Footer`, `{children}`, and `AppOverlays` rendering with:

```tsx
<Providers>
  <ExperienceShell>{children}</ExperienceShell>
</Providers>
```

Keep analytics and metadata unchanged. Remove only imports now owned by the shell.

- [ ] **Step 4: Run automated checks**

Run: `rtk pnpm test`

Expected: 2 tests pass.

Run: `rtk pnpm exec tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 5: Commit**

```powershell
rtk git add src/app/layout.tsx src/components/experience
rtk git commit -m "feat: add portfolio experience chooser"
```

### Task 4: Persona Portfolio Experience

**Files:**
- Create: `src/components/persona/persona-portfolio.tsx`
- Create: `src/components/persona/persona.module.css`

**Interfaces:**
- Produces: default export `PersonaPortfolio`.
- Consumes: `config`, `projects`, `EXPERIENCE`, `EDUCATION`, `ORGANIZATIONS`, `CERTIFICATIONS`, and `/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf`.

- [ ] **Step 1: Implement accessible screen navigation**

Use this screen model:

```ts
type PersonaScreen = "home" | "projects" | "skills" | "about" | "contact";

const menu: Array<{ screen: Exclude<PersonaScreen, "home">; label: string }> = [
  { screen: "projects", label: "Projects" },
  { screen: "skills", label: "Skills" },
  { screen: "about", label: "About" },
  { screen: "contact", label: "Contact" },
];
```

Maintain `screen`, `menuIndex`, and `transitioning`. Arrow Up/Down changes the selected home menu item, Enter opens it, and Escape returns to Home. Ignore shortcuts while a text input or textarea is focused. Every menu item is also a normal button so pointer and Tab users get equivalent behaviour.

Use a 650 ms CSS wipe. Swap `screen` after 300 ms, release `transitioning` after 650 ms, and clear both timers during effect cleanup/unmount.

- [ ] **Step 2: Render the Home and shared HUD**

Render:

- top HUD: `PORTFOLIO // ADE RAINHARD PASARIBU` and `FULL-STACK DEVELOPER · INFORMATION TECHNOLOGY`;
- eyebrow: `Explore my work`;
- name: `ADE` / `RAINHARD`;
- tagline from `config.description.long`;
- Projects, Skills, About, and Contact menu buttons;
- bottom keyboard legend and a client-side clock updated once per minute.

The name button returns to Home. Decorative background layers use `aria-hidden="true"`.

- [ ] **Step 3: Render Projects from the existing project source**

Map every object from `src/data/projects.tsx` into a card containing category, title, period, description, technology tags, and every repository link. Do not fetch GitHub at runtime and do not filter forks; the curated array is authoritative.

For multi-link projects such as UKM Band Platform, render both links with their existing labels.

- [ ] **Step 4: Render Skills from project and experience data**

Create a unique, stable list without a second skill inventory:

```ts
const technologies = Array.from(
  new Set(projects.flatMap((project) => project.technologies)),
);
```

Render technology chips in a responsive grid, followed by experience-role cards using `EXPERIENCE`. Do not invent proficiency percentages.

- [ ] **Step 5: Render About and Contact from existing portfolio data**

About renders `public/assets/me.jpg`, `config.description.long`, and mapped sections for `EXPERIENCE`, `EDUCATION`, `ORGANIZATIONS`, and `CERTIFICATIONS`. Include a download link to `/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf`.

Contact renders `config.email` and non-empty entries from `config.social`, with `target="_blank"` and `rel="noopener noreferrer"` for external links. Include a mailto CTA rather than duplicating the Classic form implementation.

- [ ] **Step 6: Add completely scoped Persona styling**

In `persona.module.css`, define:

- root palette `#08a9e6`, `#004ca3`, `#090a0f`, `#f4f1e9`;
- `100dvh` fixed shell and internal scrolling screens;
- per-screen background images from `/assets/persona/*.jpg`, dark/blue readability scrims, halftone texture, diagonal shapes, and no global body selectors;
- high-impact condensed display type using the existing `--font-display` and `--font-sans` variables;
- angled white project cards with black borders/shadows and blue hover accents;
- blue/black/off-white wipe panes;
- responsive breakpoints at 900 px and 640 px;
- `:focus-visible` outlines;
- `@media (prefers-reduced-motion: reduce)` that removes animation and transition duration.

Keep background imagery decorative and set `background-position` separately per screen so text stays readable.

- [ ] **Step 7: Run automated checks**

Run: `rtk pnpm test`

Expected: 2 tests pass.

Run: `rtk pnpm exec tsc --noEmit`

Expected: exit code 0.

Run: `rtk pnpm build`

Expected: static export completes successfully.

- [ ] **Step 8: Commit**

```powershell
rtk git add src/components/persona src/components/experience/experience-shell.tsx
rtk git commit -m "feat: add Persona portfolio experience"
```

### Task 5: Browser Verification and Polish

**Files:**
- Modify only files found defective during verification.

**Interfaces:**
- Consumes the completed dual-theme experience.
- Produces a verified desktop/mobile user flow.

- [ ] **Step 1: Start the development server**

Run: `rtk pnpm dev`

Expected: Next.js reports a local URL and remains running.

- [ ] **Step 2: Verify a fresh Classic selection**

In a browser, clear the `ade-portfolio-mode` key, reload `/`, choose Classic, and verify:

- chooser appears before the site;
- Classic portfolio renders unchanged;
- coffee-shop audio begins and the control pauses/resumes it;
- refresh loads Classic directly without replaying blocked audio;
- Switch Experience reopens the chooser.

- [ ] **Step 3: Verify Persona desktop interaction**

Choose Persona and verify:

- the previous track stops and Persona music begins;
- Arrow Up/Down and Enter navigate the home menu;
- Escape and visible Back controls return Home;
- all eight curated projects render and UKM Band has both repository links;
- About uses Ade's photo, resume facts, and CV;
- Contact uses Ade's email/social URLs;
- there is no content belonging to the template's previous owner.

- [ ] **Step 4: Verify mobile and accessibility behaviour**

At approximately 390 × 844:

- chooser choices remain readable and tappable;
- Persona screens scroll internally without horizontal overflow;
- floating experience/audio controls do not cover primary actions;
- focus indicators remain visible;
- reduced-motion emulation removes wipes/jitter without hiding content.

- [ ] **Step 5: Run final verification**

Run:

```powershell
rtk pnpm test
rtk pnpm exec tsc --noEmit
rtk pnpm build
rtk git diff --check
rtk git status --short
```

Expected: tests, typecheck, build, and whitespace check pass; status contains only intentional changes.

- [ ] **Step 6: Commit any verification fixes**

If verification required edits:

```powershell
rtk git add <verified-files>
rtk git commit -m "fix: polish dual-theme portfolio"
```

If no edits were required, do not create an empty commit.

## Self-Review

- Spec coverage: first-visit persistence, reopening chooser, per-theme audio, native Persona UI, shared Ade content, responsive design, reduced motion, and verification all map to Tasks 1–5.
- Placeholder scan: no TBD/TODO or unspecified implementation step remains.
- Type consistency: `PortfolioMode`, `MODE_TRACKS`, `STORAGE_KEY`, `isPortfolioMode`, and `otherPortfolioMode` use the same names and values throughout.
