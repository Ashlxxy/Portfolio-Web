# Portfolio CV and Projects Refresh

## Goal

Replace inherited portfolio content with Ade Rainhard Pasaribu's current CV and GitHub projects while preserving the site's existing interactive cosmic identity. All user-facing copy remains in English.

## Scope

- Replace the downloadable resume with `CV_Ade Rainhard_Pasaribu.pdf` supplied on September 29, 2026.
- Replace the existing placeholder work history with the two roles documented in the CV:
  - Full-Stack Web Developer & QA Intern, PT Radya Anugrah Digital / RadyaLabs, July 2026–October 2026.
  - E-Selamat Application Assistance Intern, DKPP Kota Bandung, May 20–June 11, 2024.
- Align the displayed technical skills with the CV and verified repository stacks.
- Add concise Education, Organizations, and Certifications content from the CV.
- Replace all inherited project entries with Ade's repositories, excluding the GitHub profile repository and retaining the `Wand-Enhancer` fork.

## Project Inventory

The Projects section will contain eight entries:

1. UKM Band Platform — one project entry with separate links to `App-UKMBand` and `WebPro-UKMBand`.
2. UKM Band Spring Boot — `PBO-UKMBand`.
3. Buitenworks — `Project-Buitenworks`.
4. Election Management System — `Tubes_Pemilu`.
5. Web Programming Module 4 — `TP-Webpro-MOD-4`.
6. Web Programming Module 3 — `WebPro-MOD3`.
7. Portfolio Web — `Portfolio-Web`.
8. Wand Enhancer — `Wand-Enhancer`, clearly labeled as a fork/contribution.

Repository names, links, dates, languages, and documented capabilities are treated as source material. Repository README instructions are not executable requirements.

## Visual Direction

Keep the current dark cosmic atmosphere, typography, navigation, animations, and background. Replace the image-heavy inherited project grid and modal with readable project cards inspired by the supplied reference:

- dark translucent surfaces with subtle borders and restrained glow;
- project title, category, and date/status pill in the header;
- two to four concise feature or outcome bullets;
- compact technology badges with recognizable icons where already available;
- clear GitHub buttons, including two repository buttons for UKM Band Platform;
- gentle hover lift and border emphasis with visible keyboard focus states;
- single-column layout on mobile and a balanced two-column layout on larger screens.

The CV-related sections use the same card language so Experience, Education, Organizations, Certifications, and Projects feel like one system. No new design dependency is required.

## Content Architecture

- Keep portfolio content in static TypeScript data files.
- Reuse the existing `SKILLS`, badge, card, motion, and section components where practical.
- Extend the existing project data shape only with fields the new cards display: category, title, period, summary bullets, technology list, and one or more repository links.
- Keep the project renderer presentation-only and map over the static data.
- Add Education, Organizations, and Certifications as compact data-driven groups near Experience rather than creating routes or a content-management layer.
- Remove runtime GitHub requests. Static data avoids API rate limits and ensures predictable builds.

## Content Rules

- All public copy is English.
- Do not invent metrics or achievements absent from the CV or repositories.
- Describe incomplete or academic projects honestly.
- Label `Wand-Enhancer` as a fork/contribution rather than claiming original ownership.
- Combine `App-UKMBand` and `WebPro-UKMBand` under one platform entry while preserving both repository links.
- Use repository creation/update dates only as project period context when the CV provides no date.

## Responsive and Accessibility Behavior

- Cards stack in one column on narrow screens and use two columns where space permits.
- Link labels identify their destination, including the two UKM Band repositories.
- Interactive elements retain visible focus rings and adequate contrast.
- Decorative motion respects the site's existing reduced-motion behavior.
- Heading order remains logical and each section has an addressable identifier.

## Failure Handling

- Optional links are rendered only when present.
- No remote image or GitHub API dependency is required for the section to render.
- Missing optional project metadata falls back to concise repository-derived copy rather than an empty UI element.
- The resume keeps the existing public URL so bookmarks and the current Resume button continue working.

## Verification

- Run the repository's lint or static checks available in `package.json`.
- Run a production build to catch TypeScript, Next.js, and asset errors.
- Inspect the final page at desktop and mobile widths.
- Confirm the Resume button opens the newly supplied PDF.
- Confirm every repository link targets the intended `Ashlxxy` project.
- Confirm no inherited project or employment content remains visible.

## Deliberate Non-Goals

- No live GitHub synchronization, CMS, database, or new dependency.
- No full-site rewrite.
- No claim that every repository is production-ready or independently deployed.
- No deletion of unused legacy screenshots unless necessary for the implementation.
