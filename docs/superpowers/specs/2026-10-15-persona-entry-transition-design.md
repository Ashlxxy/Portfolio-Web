# Persona Entry Transition Design

## Goal

Add a distinctive Persona-style transition when a visitor selects Persona Mode, whether from the initial experience chooser or while switching from Classic Mode. The transition must feel immediate, keep the soundtrack tied to the user's click, and avoid delaying access to the portfolio.

## Interaction

1. The visitor clicks the Persona Mode card.
2. The soundtrack starts from that user gesture, as it does today.
3. A fixed, pointer-blocking overlay sweeps across the viewport using three diagonal layers: paper white, ink black, then Persona blue.
4. Persona Mode is mounted when the wipe fully covers the viewport, so the chooser and Persona page never visibly overlap.
5. The layers continue off-screen and reveal the Persona home screen.
6. Repeated selection is ignored while the transition is running.

The complete transition lasts 680 ms, with Persona Mode mounted at 330 ms while the viewport is covered. It runs only when entering Persona Mode; Classic Mode keeps the existing immediate selection behavior.

## Visual Direction

Reuse the established Persona palette and diagonal geometry rather than introducing a second motion language. The layers animate only `transform`, use a strong custom ease-in-out curve, and remain above the chooser, portfolio, and floating controls for the duration of the transition.

The Persona screen is revealed directly by the departing wipe without a separate content animation, so navigation is interactive as soon as the overlay clears.

## Architecture

- `ExperienceShell` owns the transition state because it controls both the chooser and the selected experience.
- `ExperienceChooser` remains a presentational selector and continues to call `onSelect(mode)`.
- A small entry-transition overlay is rendered by `ExperienceShell`. It receives an active state and has no portfolio data dependencies.
- Selecting Persona starts audio immediately, activates the overlay, switches the stored/rendered mode at the covered midpoint, then closes the chooser and clears the transition state after the animation.
- Selecting Classic follows the current path without the Persona overlay.

No new dependency is required. Timing constants live beside the transition state so the midpoint and completion callbacks stay aligned with the CSS animation.

## Accessibility and Failure Handling

- The overlay is decorative and hidden from assistive technology.
- While active, it blocks pointer input to prevent duplicate selections.
- With `prefers-reduced-motion: reduce`, the diagonal movement is replaced by a brief opacity fade and the mode switches without a long wait.
- Audio failure must not block the visual transition or mode selection; existing audio error handling remains authoritative.
- Pending timers are cleared if the shell unmounts.

## Verification

- Unit-test the selection timing/state helper or transition contract before implementation.
- Verify Persona selection does not switch content before the overlay reaches its covered midpoint.
- Verify Classic selection remains immediate.
- Verify repeated selection during an active transition is ignored.
- Run the existing test suite, TypeScript check, and production build.
- Inspect the initial chooser-to-Persona path and Classic-to-Persona path at desktop and mobile viewport sizes, including reduced-motion behavior.

## Scope Boundaries

This change does not redesign the chooser, alter internal Persona section wipes, add a transition when entering Classic Mode, or change soundtrack files and volume.
