# Dual-Theme Portfolio Design

Date: 2026-10-15

## Goal

Add a first-visit experience selector to Ade Rainhard Pasaribu's existing portfolio. Visitors choose between the current portfolio ("Classic") and a Persona-inspired experience. The selection is remembered, can be changed later, and the selection click starts the chosen theme's background music.

All public-facing copy remains in English.

## Selected Approach

Use one Next.js application with a small client-side experience shell:

- Keep the existing Classic portfolio and its routes/components intact.
- Rebuild the supplied Persona template as native React/Next.js components rather than embedding it in an iframe or shipping a second standalone app.
- Reuse the portfolio's existing data modules for projects, resume facts, contact details, and social links.
- Store the selected experience in `localStorage` and expose a persistent switch control in both experiences.
- Own music playback in the shared experience shell so switching themes also switches tracks without competing audio elements.

This keeps one source of truth for content and avoids duplicating the site's framework, metadata, analytics, or deployment configuration.

## Visitor Flow

1. On the first visit, show a full-viewport chooser before either portfolio experience becomes interactive.
2. Offer two clearly labelled choices:
   - **Classic Mode** — the existing modern scrolling portfolio.
   - **Persona Mode** — the game-menu-inspired portfolio.
3. A click or keyboard confirmation:
   - stores the selected mode;
   - reveals the selected experience;
   - starts that mode's background track, using the same user gesture required by browser autoplay policies.
4. On later visits, load the stored mode directly.
5. A compact **Switch Experience** control remains available in both modes. Switching changes both the visual experience and active track.
6. A persistent audio control allows pause/resume and communicates its state accessibly.

If stored data is invalid or unavailable, fall back to the chooser without breaking the page.

## Experience Chooser

The chooser will visually bridge both styles instead of looking like a generic modal:

- a split composition with a calm, dark Classic card and a high-contrast blue/black/white Persona card;
- Ade's name and a short "Choose your experience" prompt;
- short descriptions so visitors understand the difference before entering;
- visible focus states and full keyboard operation;
- restrained entrance motion disabled when reduced motion is requested.

## Classic Mode

Classic Mode preserves the current page structure, content, interactions, navigation, realtime elements, and theme toggle. Only the shared experience/audio controls are added around it.

Its soundtrack is copied into the site as:

`public/assets/sounds/classic-background.mp3`

Source provided by the user:

`C:\Users\Ash\Downloads\5 Minute Countdown Timer - Cozy Coffee Shop With Fireplace & Music (Jazz).mp3`

## Persona Mode

Persona Mode adapts the supplied template at:

`C:\Users\Ash\Downloads\Persona_style_portfolio-main\Persona_style_portfolio-main`

The visual language retained from the reference includes:

- blue, black, and off-white graphic layers;
- ransom-note display typography;
- angled panels, bold shadows, halftone texture, and diagonal wipe transitions;
- keyboard- and pointer-driven menu selection;
- separate Home, Projects, Skills, About, and Contact screens;
- responsive layouts and reduced-motion fallbacks.

The original owner's identity, biography, repositories, skills, CV, email, and social links will not be used. Persona Mode will instead render Ade's existing portfolio content:

- Home: Ade's name, role, and portfolio introduction.
- Projects: the existing curated `projects` data, including the combined UKM Band Platform entry and both repository links.
- Skills: technologies already represented by the Classic portfolio and project data.
- About: Ade's education, experience, organizations, certifications, profile photo, and current CV.
- Contact: Ade's email and existing social links, with the current portfolio contact path retained where practical.

Persona Mode will be implemented as React components and scoped CSS so its fixed-screen rules, cursor treatment, and typography do not leak into Classic Mode or blog pages.

Its soundtrack is copied into the site as:

`public/assets/sounds/persona-background.mp3`

Source provided by the user:

`C:\Users\Ash\Downloads\Persona 3 Reload - Color Your Night (with Lyrics).mp3`

## Audio Behaviour

- Classic and Persona each have one looping track.
- Selection starts at a conservative volume and never stacks two tracks.
- Switching mode pauses the old track, resets it, loads the new source, and attempts playback.
- Pause/resume state is controlled by one accessible button.
- Playback rejection or media loading failure is handled silently in the application while the control reports that audio is unavailable/paused; the portfolio remains usable.
- Audio does not start before an explicit visitor gesture.

## State and Component Boundaries

The smallest complete structure is:

- an experience provider/shell for selected mode, persisted choice, and audio state;
- a chooser overlay shown only when no valid stored mode exists;
- the existing Classic tree rendered unchanged beneath the shell;
- one Persona portfolio root with its internal screen state;
- shared floating controls for experience switching and audio.

No new third-party dependency is required. Existing React, Motion, Tailwind, and CSS capabilities are sufficient.

## Accessibility and Responsive Behaviour

- All chooser and Persona navigation actions use semantic buttons/links.
- Keyboard controls support Arrow Up/Down, Enter, and Escape while preserving normal Tab navigation.
- Focus indicators remain visible.
- Audio controls include labels and do not rely on icons alone.
- Decorative artwork is hidden from assistive technology.
- Motion-heavy transitions are minimized when `prefers-reduced-motion` is enabled.
- Persona layouts collapse cleanly for mobile rather than preserving desktop-only absolute positioning.

## Verification

- Unit checks for stored-mode validation and audio source selection where logic is non-trivial.
- TypeScript check and production build.
- Manual browser verification at desktop and mobile widths for:
  - first-visit chooser;
  - persisted selection;
  - Classic and Persona switching;
  - both tracks starting only after selection;
  - pause/resume and track replacement;
  - Persona keyboard navigation;
  - project links, CV link, contact links, and responsive layouts;
  - reduced-motion behaviour.

## Out of Scope

- Replacing or editing the supplied MP3 recordings.
- Adding a playlist, volume slider, waveform, or per-page song selection.
- Rewriting Classic Mode's existing visual design.
- Live GitHub API fetching in Persona Mode; curated project data remains the reliable source of truth.
