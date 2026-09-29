# Portfolio CV and Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace inherited resume, experience, and project content with Ade Rainhard Pasaribu's verified CV and GitHub work, presented in polished responsive cards.

**Architecture:** Keep the existing Next.js single-page structure and interactive background. Store all portfolio content in the existing static TypeScript data files, render it through the existing section components, and use the installed Card, Badge, Motion, and Lucide components without adding dependencies or runtime GitHub requests.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Motion, Lucide React, pnpm.

## Global Constraints

- Keep all user-facing copy in English.
- Do not invent metrics or achievements absent from the CV or repositories.
- Exclude the `Ashlxxy` profile repository and include `Wand-Enhancer` as a clearly labeled fork/contribution.
- Combine `App-UKMBand` and `WebPro-UKMBand` into one project with two repository links.
- Keep the existing resume URL `/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf`.
- Do not add a dependency, CMS, database, live GitHub synchronization, or new route.
- Preserve the existing cosmic background, navigation, and reduced-motion behavior.

## File Structure

- Modify `public/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf`: downloadable CV binary.
- Modify `src/data/constants.ts`: verified experience, education, organization, and certification data.
- Modify `src/components/sections/experience.tsx`: CV timeline and supporting credential cards.
- Modify `src/components/sections/hero.tsx`: accurate professional title.
- Replace `src/data/projects.tsx`: plain project records with no presentation JSX.
- Modify `src/components/sections/projects.tsx`: responsive project-card renderer.
- Modify `src/data/config.ts`: accurate SEO copy and project keywords.
- Modify `README.md`: describe the refreshed project and CV sections.

---

### Task 1: Replace Resume and CV Content

**Files:**
- Modify: `public/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf`
- Modify: `src/data/constants.ts`
- Modify: `src/components/sections/experience.tsx`
- Modify: `src/components/sections/hero.tsx`

**Interfaces:**
- Consumes: existing `SkillNames`, `SKILLS`, `Card`, `Badge`, `SectionHeader`, and `SectionWrapper` exports.
- Produces: `EXPERIENCE`, `EDUCATION`, `ORGANIZATIONS`, and `CERTIFICATIONS` static arrays consumed by `ExperienceSection`.

- [ ] **Step 1: Run the CV-content check and verify the old content fails it**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/constants.ts"; if ($source.Contains("OmniNexus") -or -not $source.Contains("RadyaLabs") -or -not $source.Contains("CERTIFICATIONS")) { throw "CV content is stale" }'
```

Expected: exit code 1 with `CV content is stale`.

- [ ] **Step 2: Replace the existing `EXPERIENCE` block and append the supporting CV arrays**

In `src/data/constants.ts`, keep the current skill enum and `SKILLS` record, then replace `EXPERIENCE` with:

```ts
export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Jul 2026",
    endDate: "Oct 2026",
    title: "Full-Stack Web Developer & QA Intern",
    company: "PT Radya Anugrah Digital · RadyaLabs",
    description: [
      "Supported full-stack web development across user-facing and server-side work.",
      "Performed quality-assurance checks to help validate application behavior and delivery readiness.",
    ],
    skills: [
      SkillNames.JS,
      SkillNames.HTML,
      SkillNames.CSS,
      SkillNames.REACT,
      SkillNames.NODEJS,
      SkillNames.GIT,
    ],
  },
  {
    id: 2,
    startDate: "20 May 2024",
    endDate: "11 Jun 2024",
    title: "E-Selamat Application Assistance Intern",
    company: "DKPP Kota Bandung",
    description: [
      "Assisted activities supporting the E-Selamat application in Bandung.",
    ],
    skills: [SkillNames.GIT],
  },
];

export const EDUCATION = [
  {
    institution: "Telkom University",
    program: "Bachelor of Information Technology",
    period: "2023 — Present",
  },
];

export const ORGANIZATIONS = [
  {
    name: "Megabit Committee",
    role: "Decoration Division",
    period: "Jul 2025",
    description: "Supported event organization, promotion, and social activities.",
  },
  {
    name: "Internet of Things Laboratory",
    role: "ESP Study Group",
    period: "Jan — Jun 2026",
    description: "Participated in guided learning and hands-on ESP practice.",
  },
];

export const CERTIFICATIONS = [
  { title: "AI Ready Certificate", issuer: "ASEAN Foundation", date: "28 Aug 2026" },
  { title: "MikroTik Certified Routing Engineer (MTCRE)", issuer: "MikroTik", date: "Aug 2026" },
  { title: "Certified Supply Chain Analyst (CSCA)", issuer: "ISCEA", date: "20 Jan 2026" },
  { title: "Certified Cybersecurity Educator Professional (CCEP)", date: "17 Dec 2025" },
  { title: "CAATIS CoE Program", issuer: "Telkom University", date: "5 Sep 2024" },
];
```

- [ ] **Step 3: Replace `ExperienceSection` with a CV-focused renderer**

Use this structure in `src/components/sections/experience.tsx`:

```tsx
"use client";

import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  ORGANIZATIONS,
  SkillNames,
  SKILLS,
} from "@/data/constants";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";

const ExperienceSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="experience" className="z-10 min-h-screen py-20">
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
      <SectionHeader
        id="experience"
        title="Experience"
        desc="Work, education, and credentials from my current resume."
        className="mb-12 mt-0 md:mb-20"
      />

      <div className="space-y-6">
        {EXPERIENCE.map((experience, index) => (
          <motion.article
            key={experience.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.08 }}
          >
            <Card className="border-white/10 bg-background/70 shadow-xl backdrop-blur-md transition-colors hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold md:text-2xl">
                      {experience.title}
                    </CardTitle>
                    <p className="font-medium text-muted-foreground">{experience.company}</p>
                  </div>
                  <Badge variant="secondary" className="w-fit font-mono font-normal">
                    {experience.startDate} — {experience.endDate}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="ml-5 list-disc space-y-2 text-muted-foreground">
                  {experience.description.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((name) => {
                    const skill = SKILLS[name as SkillNames];
                    return (
                      <Badge key={name} variant="outline" className="gap-2 bg-secondary/30 font-normal">
                        <img src={skill.icon} alt="" className="h-3.5 w-3.5 object-contain" />
                        {skill.label}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <InfoCard title="Education">
          {EDUCATION.map((item) => (
            <Detail key={item.program} title={item.program} meta={item.institution} date={item.period} />
          ))}
        </InfoCard>
        <InfoCard title="Organizations">
          {ORGANIZATIONS.map((item) => (
            <Detail key={item.name} title={item.name} meta={item.role} date={item.period} body={item.description} />
          ))}
        </InfoCard>
        <InfoCard title="Certifications">
          {CERTIFICATIONS.map((item) => (
            <Detail key={item.title} title={item.title} meta={item.issuer} date={item.date} />
          ))}
        </InfoCard>
      </div>
    </div>
    </SectionWrapper>
  );
};

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="border-white/10 bg-background/70 backdrop-blur-md">
    <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
    <CardContent className="space-y-5">{children}</CardContent>
  </Card>
);

const Detail = ({ title, meta, date, body }: { title: string; meta?: string; date: string; body?: string }) => (
  <div className="border-l border-primary/30 pl-4">
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold leading-snug">{title}</h3>
      {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      <span className="font-mono text-xs text-muted-foreground">{date}</span>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
    </div>
  </div>
);

export default ExperienceSection;
```

- [ ] **Step 4: Update the hero title and replace the resume binary**

In `src/components/sections/hero.tsx`, replace:

```tsx
A Full Stack Web Developer
```

with:

```tsx
Full-Stack Developer & Information Technology Student
```

Then copy the supplied PDF over the existing public asset:

```powershell
rtk powershell -NoProfile -Command "Copy-Item -LiteralPath 'C:\Users\Ash\Downloads\CV_Ade Rainhard Pasaribu.pdf' -Destination 'public\assets\resume\CV_Ade_Rainhard_Pasaribu.pdf' -Force"
```

- [ ] **Step 5: Run the CV-content and compile checks**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/constants.ts"; if ($source.Contains("OmniNexus") -or -not $source.Contains("RadyaLabs") -or -not $source.Contains("CERTIFICATIONS")) { throw "CV content is stale" }'
rtk pnpm exec tsc --noEmit
```

Expected: both commands exit 0 with no TypeScript errors.

- [ ] **Step 6: Commit Task 1**

```powershell
rtk git add public/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf src/data/constants.ts src/components/sections/experience.tsx src/components/sections/hero.tsx
rtk git commit -m "feat: refresh portfolio resume content"
```

---

### Task 2: Replace Inherited Projects with Repository Cards

**Files:**
- Replace: `src/data/projects.tsx`
- Modify: `src/components/sections/projects.tsx`

**Interfaces:**
- Consumes: `Project` and default `projects` export from `src/data/projects.tsx`.
- Produces: eight static project records and a card renderer with optional multiple repository links.

- [ ] **Step 1: Run the project-content check and verify the old content fails it**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/projects.tsx"; if ($source.Contains("Coding Ducks") -or -not $source.Contains("UKM Band Platform") -or -not $source.Contains("Wand Enhancer")) { throw "Project content is stale" }'
```

Expected: exit code 1 with `Project content is stale`.

- [ ] **Step 2: Replace `src/data/projects.tsx` with plain project data**

```ts
export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  links: ProjectLink[];
};

const projects: Project[] = [
  {
    id: "ukm-band-platform",
    title: "UKM Band Platform",
    category: "Mobile & Web Music Platform",
    period: "Oct 2025 — Jun 2026",
    description: "A digital music platform for Telkom University's student band community, delivered across mobile, web, and API clients.",
    highlights: [
      "Built a Flutter mobile experience for songs, playlists, listening history, likes, comments, and user profiles.",
      "Delivered a Laravel 12 web portal and REST API with role-based user and administrator flows.",
      "Integrated Firebase Authentication and Cloud Firestore as an optional mobile backend.",
    ],
    technologies: ["Flutter", "Dart", "Laravel", "PHP", "Firebase", "REST API"],
    links: [
      { label: "Mobile repository", href: "https://github.com/Ashlxxy/App-UKMBand" },
      { label: "Web repository", href: "https://github.com/Ashlxxy/WebPro-UKMBand" },
    ],
  },
  {
    id: "pbo-ukm-band",
    title: "UKM Band Spring Boot",
    category: "Academic Web Application",
    period: "Dec 2025",
    description: "A Java-based music player and content-management application created for an object-oriented programming course.",
    highlights: [
      "Implemented authentication, song management, playlists, likes, listening history, comments, and feedback.",
      "Added an administrator dashboard for content management and popular-song statistics.",
    ],
    technologies: ["Java 17", "Spring Boot", "MySQL", "JSP", "Maven"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/PBO-UKMBand" }],
  },
  {
    id: "buitenworks",
    title: "Buitenworks",
    category: "Fashion E-Commerce Prototype",
    period: "Nov 2025 — Jun 2026",
    description: "A lightweight fashion storefront prototype focused on responsive UI and interaction design.",
    highlights: [
      "Designed responsive product, community, archive, account, and brand pages.",
      "Implemented a cart drawer, authentication modal, masonry gallery, and tab interactions without a framework.",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/Project-Buitenworks" }],
  },
  {
    id: "election-system",
    title: "Election Management System",
    category: "Command-Line Application",
    period: "Jun 2024",
    description: "A Go command-line application modeling election administration and voter workflows.",
    highlights: [
      "Supports party, candidate, and voter data entry, editing, deletion, sorting, and searching.",
      "Provides separate administrator and voter flows with login and voting-time validation.",
    ],
    technologies: ["Go", "CLI", "Data Structures", "Search & Sort"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/Tubes_Pemilu" }],
  },
  {
    id: "webpro-module-4",
    title: "Web Programming Module 4",
    category: "Responsive Landing Page",
    period: "Oct — Dec 2025",
    description: "A responsive multi-section landing-page exercise with a hero, collection grid, about content, and login page.",
    highlights: [
      "Practiced responsive layout, navigation, cards, imagery, and page-level styling.",
      "Built with native browser technologies and no frontend framework.",
    ],
    technologies: ["HTML5", "CSS3", "Responsive Design"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/TP-Webpro-MOD-4" }],
  },
  {
    id: "webpro-module-3",
    title: "Web Programming Module 3",
    category: "Personal Profile Exercise",
    period: "Sep 2025",
    description: "An introductory semantic HTML profile page created as a web-programming exercise.",
    highlights: [
      "Structured biodata and skills with tables, media, external links, and a contact form.",
      "Established the semantic HTML foundation used in later web coursework.",
    ],
    technologies: ["HTML5", "Forms", "Tables", "Media"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/WebPro-MOD3" }],
  },
  {
    id: "portfolio-web",
    title: "Interactive Portfolio",
    category: "Creative Developer Portfolio",
    period: "May 2026 — Present",
    description: "This interactive portfolio combines a modern content experience with real-time, motion, and 3D details.",
    highlights: [
      "Built a responsive Next.js portfolio with an interactive 3D skill keyboard and animated section transitions.",
      "Added project showcases, MDX blog content, realtime presence features, and a direct contact flow.",
      "Configured static deployment for Cloudflare Workers Assets.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Spline", "Cloudflare"],
    links: [{ label: "GitHub", href: "https://github.com/Ashlxxy/Portfolio-Web" }],
  },
  {
    id: "wand-enhancer",
    title: "Wand Enhancer",
    category: "Open-Source Fork & Contribution",
    period: "Aug 2026",
    description: "A maintained fork of an interoperability and UX extension for the Wand desktop application.",
    highlights: [
      "Extends local configuration, layout, theming, and compatibility workflows for the desktop client.",
      "Includes a LAN remote-control panel and support for trusted custom renderer scripts.",
      "Combines a .NET patcher, native helper, and web-panel tooling.",
    ],
    technologies: ["C#", ".NET", "C", "CMake", "PowerShell", "WebSocket"],
    links: [{ label: "Fork on GitHub", href: "https://github.com/Ashlxxy/Wand-Enhancer" }],
  },
];

export default projects;
```

- [ ] **Step 3: Replace the modal gallery with responsive reference-style cards**

Replace `src/components/sections/projects.tsx` with:

```tsx
"use client";

import projects, { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionWrapper from "@/components/ui/section-wrapper";
import { ArrowUpRight, Github } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { SectionHeader } from "./section-header";

const ProjectsSection = () => (
  <SectionWrapper id="projects" className="z-10 min-h-screen py-20">
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
      <SectionHeader
        id="projects"
        title="Projects"
        desc="Selected builds from my GitHub and academic work."
        className="mb-12 mt-0 md:mb-20"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : Math.min(index, 3) * 0.06 }}
    className="h-full"
  >
    <Card className="group relative flex h-full flex-col overflow-hidden border-white/10 bg-background/75 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-primary/5 motion-reduce:transform-none motion-reduce:transition-none">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 font-mono text-[10px] uppercase tracking-wider">
              {project.category}
            </Badge>
            <CardTitle className="text-2xl font-bold tracking-tight">{project.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="w-fit shrink-0 font-mono font-normal">
            {project.period}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6">
        <p className="leading-relaxed text-muted-foreground">{project.description}</p>
        <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground marker:text-primary/70">
          {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <div className="mt-auto space-y-5 pt-2">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <Badge key={technology} variant="secondary" className="bg-secondary/55 font-normal">
                {technology}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
            {project.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.article>
  );
};

export default ProjectsSection;
```

- [ ] **Step 4: Run the project-content and compile checks**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/projects.tsx"; if ($source.Contains("Coding Ducks") -or -not $source.Contains("UKM Band Platform") -or -not $source.Contains("Wand Enhancer")) { throw "Project content is stale" }'
rtk pnpm exec tsc --noEmit
```

Expected: both commands exit 0, with no old project names and no TypeScript errors.

- [ ] **Step 5: Commit Task 2**

```powershell
rtk git add src/data/projects.tsx src/components/sections/projects.tsx
rtk git commit -m "feat: showcase verified github projects"
```

---

### Task 3: Refresh Metadata and Verify the Finished Page

**Files:**
- Modify: `src/data/config.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: final user-facing project and CV vocabulary from Tasks 1 and 2.
- Produces: accurate metadata and repository documentation.

- [ ] **Step 1: Run the inherited-metadata check and verify it fails**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/config.ts"; if ($source.Contains("Coding Ducks") -or -not $source.Contains("UKM Band")) { throw "Metadata is stale" }'
```

Expected: exit code 1 with `Metadata is stale`.

- [ ] **Step 2: Update metadata and README copy**

In `src/data/config.ts`, use:

```ts
title: "Ade Rainhard Pasaribu | Full-Stack Developer",
description: {
  long: "Portfolio of Ade Rainhard Pasaribu, an Information Technology student and full-stack developer building responsive web, mobile, API, and interactive digital experiences.",
  short: "Ade Rainhard Pasaribu — full-stack developer and Information Technology student.",
},
keywords: [
  "Ade Rainhard Pasaribu",
  "Ashlxxy",
  "full-stack developer",
  "information technology",
  "React",
  "Next.js",
  "Node.js",
  "Flutter",
  "Laravel",
  "Spring Boot",
  "UKM Band",
  "Buitenworks",
  "Wand Enhancer",
],
```

In `README.md`, replace references to inherited showcases with this concise feature list:

```md
- Interactive 3D portfolio hero and skill keyboard
- Resume-backed experience, education, organization, and certification content
- Responsive project cards sourced from Ade's public GitHub repositories
- Blog page with MDX content
- Contact section with mail draft support
- Static export deployment for Cloudflare Workers Assets
```

- [ ] **Step 3: Run metadata, stale-content, TypeScript, and production-build checks**

Run:

```powershell
rtk powershell -NoProfile -Command '$source=Get-Content -Raw "src/data/config.ts"; if ($source.Contains("Coding Ducks") -or -not $source.Contains("UKM Band")) { throw "Metadata is stale" }'
rtk rg -n "OmniNexus|Coding Ducks|Coupon Luxury|The Booking Desk|GhostChat|JNTUA" src/data src/components/sections
rtk pnpm exec tsc --noEmit
rtk pnpm run build
```

Expected: metadata check exits 0; `rg` returns no matches; TypeScript exits 0; production build exits 0.

- [ ] **Step 4: Run the app and inspect desktop and mobile layouts**

Run:

```powershell
rtk pnpm dev
```

Inspect `/` at approximately 1440×900 and 390×844. Confirm:

- resume link opens the supplied one-page CV;
- experience and credential cards contain only the approved CV content;
- all eight project cards render without overflow;
- UKM Band has two distinct repository links;
- every external link opens the intended `Ashlxxy` repository;
- focus states are visible and text contrast remains readable;
- no inherited job or project name appears.

- [ ] **Step 5: Commit Task 3**

```powershell
rtk git add src/data/config.ts README.md
rtk git commit -m "docs: align portfolio metadata"
```

- [ ] **Step 6: Review the final diff**

Run:

```powershell
rtk git status --short
rtk git diff HEAD~3 --check
rtk git diff HEAD~3 --stat
```

Expected: clean working tree, no whitespace errors, and changes limited to the files named by this plan.
