"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Download, Mail } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { config } from "@/data/config";
import projects from "@/data/projects";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, ORGANIZATIONS } from "@/data/constants";
import styles from "./persona.module.css";

type PersonaScreen = "home" | "projects" | "skills" | "about" | "contact";
const menu: Array<{ screen: Exclude<PersonaScreen, "home">; label: string }> = [
  { screen: "projects", label: "Projects" },
  { screen: "skills", label: "Skills" },
  { screen: "about", label: "About" },
  { screen: "contact", label: "Contact" },
];
const screenTitles: Record<Exclude<PersonaScreen, "home">, string> = {
  projects: "Projects", skills: "Skills", about: "About", contact: "Contact",
};

export default function PersonaPortfolio() {
  const [screen, setScreen] = useState<PersonaScreen>("home");
  const [menuIndex, setMenuIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [clock, setClock] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const technologies = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.technologies))),
    [],
  );

  const goTo = useCallback((nextScreen: PersonaScreen) => {
    if (transitioning || nextScreen === screen) return;
    setTransitioning(true);
    const swapDelay = shouldReduceMotion ? 0 : 280;
    const finishDelay = shouldReduceMotion ? 0 : 680;
    timers.current.push(
      setTimeout(() => setScreen(nextScreen), swapDelay),
      setTimeout(() => setTransitioning(false), finishDelay),
    );
  }, [screen, shouldReduceMotion, transitioning]);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat("en", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date()));
    updateClock();
    const interval = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "Escape" && screen !== "home") {
        event.preventDefault();
        goTo("home");
        return;
      }
      if (screen !== "home" || transitioning) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setMenuIndex((current) => (current + direction + menu.length) % menu.length);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        goTo(menu[menuIndex].screen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, menuIndex, screen, transitioning]);

  return (
    <main className={`${styles.root} ${styles[screen]}`} aria-label="Persona portfolio">
      <div className={styles.art} aria-hidden="true" />
      <div className={styles.halftone} aria-hidden="true" />
      <div className={styles.slash} aria-hidden="true" />

      <header className={styles.hudTop}>
        <button type="button" className={styles.hudTag} onClick={() => goTo("home")}>
          Portfolio // Ade Rainhard Pasaribu
        </button>
        <span className={`${styles.hudTag} ${styles.hudTagAlt}`}>
          Full-Stack Developer · Information Technology
        </span>
      </header>

      <div className={styles.stage}>
        {screen === "home" ? (
          <HomeScreen menuIndex={menuIndex} onHover={setMenuIndex} onNavigate={goTo} />
        ) : (
          <section className={styles.subScreen} aria-labelledby={`persona-${screen}-title`}>
            <div className={styles.screenHeadingRow}>
              <h2 id={`persona-${screen}-title`} className={styles.screenHeading}>
                {screenTitles[screen]}
              </h2>
              <button type="button" className={styles.backButton} onClick={() => goTo("home")}>
                <ArrowLeft className={styles.icon} aria-hidden="true" /> Back
              </button>
            </div>
            {screen === "projects" && <ProjectsScreen />}
            {screen === "skills" && <SkillsScreen technologies={technologies} />}
            {screen === "about" && <AboutScreen />}
            {screen === "contact" && <ContactScreen />}
          </section>
        )}
      </div>

      <footer className={styles.hudBottom}>
        <span><kbd>↑↓</kbd> Select</span>
        <span><kbd>Enter</kbd> Confirm</span>
        <span><kbd>Esc</kbd> Back</span>
        <time>{clock}</time>
      </footer>

      <div className={`${styles.wipe} ${transitioning ? styles.wipeActive : ""}`} aria-hidden="true">
        <span className={styles.wipeWhite} />
        <span className={styles.wipeBlack} />
        <span className={styles.wipeBlue} />
      </div>
    </main>
  );
}

function HomeScreen({ menuIndex, onHover, onNavigate }: {
  menuIndex: number;
  onHover: (index: number) => void;
  onNavigate: (screen: PersonaScreen) => void;
}) {
  return (
    <section className={styles.homeScreen} aria-labelledby="persona-home-title">
      <div className={styles.homeCopy}>
        <p className={styles.eyebrow}>Explore my work</p>
        <h1 id="persona-home-title" className={styles.name}>
          <span>Ade</span><span className={styles.nameCutout}>Rainhard</span>
        </h1>
        <p className={styles.tagline}>{config.description.long}</p>
      </div>
      <nav className={styles.menu} aria-label="Persona sections">
        {menu.map((item, index) => (
          <button
            key={item.screen}
            type="button"
            className={`${styles.menuItem} ${index === menuIndex ? styles.menuItemSelected : ""}`}
            aria-current={index === menuIndex ? "page" : undefined}
            onMouseEnter={() => onHover(index)}
            onFocus={() => onHover(index)}
            onClick={() => onNavigate(item.screen)}
          >
            <span>{item.label}</span><b aria-hidden="true">◀</b>
          </button>
        ))}
      </nav>
    </section>
  );
}

function ProjectsScreen() {
  return (
    <div>
      <p className={styles.sectionKicker}>Selected work · {projects.length} projects</p>
      <div className={styles.projectGrid}>
        {projects.map((project, index) => (
          <article key={project.id} className={styles.projectCard} style={{ "--card-turn": `${index % 2 === 0 ? -0.45 : 0.45}deg` } as React.CSSProperties}>
            <div className={styles.projectMeta}><span>{project.category}</span><time>{project.period}</time></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className={styles.highlights}>
              {project.highlights.slice(0, 2).map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
            <div className={styles.technologyList} aria-label="Technologies">
              {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
            <div className={styles.projectLinks}>
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}<ArrowUpRight className={styles.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SkillsScreen({ technologies }: { technologies: string[] }) {
  return (
    <div className={styles.skillsLayout}>
      <section className={styles.paperPanel}>
        <p className={styles.sectionKicker}>Built across web, mobile, APIs, and tooling</p>
        <h3>Technical arsenal</h3>
        <div className={styles.skillGrid}>
          {technologies.map((technology, index) => (
            <span key={technology}><b>{String(index + 1).padStart(2, "0")}</b>{technology}</span>
          ))}
        </div>
      </section>
      <section className={`${styles.paperPanel} ${styles.darkPanel}`}>
        <p className={styles.sectionKicker}>Professional experience</p>
        <div className={styles.experienceList}>
          {EXPERIENCE.map((experience) => (
            <article key={experience.id}>
              <time>{experience.startDate} — {experience.endDate}</time>
              <h3>{experience.title}</h3><p>{experience.company}</p>
              <ul>{experience.description.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className={styles.aboutLayout}>
      <figure className={styles.portrait}>
        <img src="/assets/me.jpg" alt="Ade Rainhard Pasaribu" />
        <figcaption>Ade · Bandung</figcaption>
      </figure>
      <div className={styles.aboutContent}>
        <p className={styles.aboutLead}>{config.description.long}</p>
        <InfoGroup title="Education">{EDUCATION.map((item) => <InfoItem key={item.program} title={item.program} meta={item.institution} date={item.period} />)}</InfoGroup>
        <InfoGroup title="Experience">{EXPERIENCE.map((item) => <InfoItem key={item.id} title={item.title} meta={item.company} date={`${item.startDate} — ${item.endDate}`} />)}</InfoGroup>
        <InfoGroup title="Organizations">{ORGANIZATIONS.map((item) => <InfoItem key={item.name} title={item.name} meta={item.role} date={item.period} body={item.description} />)}</InfoGroup>
        <InfoGroup title="Certifications">{CERTIFICATIONS.map((item) => <InfoItem key={item.title} title={item.title} meta={item.issuer} date={item.date} />)}</InfoGroup>
        <a className={styles.primaryCta} href="/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf" download>
          <Download className={styles.icon} aria-hidden="true" /> Download my CV
        </a>
      </div>
    </div>
  );
}

function InfoGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className={styles.infoGroup}><h3>{title}</h3><div>{children}</div></section>;
}

function InfoItem({ title, meta, date, body }: { title: string; meta?: string; date: string; body?: string }) {
  return (
    <article className={styles.infoItem}>
      <time>{date}</time><h4>{title}</h4>{meta && <p>{meta}</p>}{body && <p>{body}</p>}
    </article>
  );
}

function ContactScreen() {
  const socialLinks = Object.entries(config.social).filter((entry): entry is [string, string] => Boolean(entry[1]));
  return (
    <div className={styles.contactLayout}>
      <section className={styles.contactStatement}>
        <p className={styles.sectionKicker}>Have a project or opportunity?</p>
        <h3>Let&apos;s build something worth remembering.</h3>
        <p>I&apos;m open to full-stack development, mobile, API, QA, and collaborative software projects.</p>
        <a className={styles.primaryCta} href={`mailto:${config.email}`}><Mail className={styles.icon} aria-hidden="true" /> Email me</a>
      </section>
      <nav className={styles.contactLinks} aria-label="Contact links">
        <a href={`mailto:${config.email}`}><span>Email</span><strong>{config.email}</strong><ArrowUpRight aria-hidden="true" /></a>
        {socialLinks.map(([network, href]) => (
          <a key={network} href={href} target="_blank" rel="noopener noreferrer"><span>{network}</span><strong>Open profile</strong><ArrowUpRight aria-hidden="true" /></a>
        ))}
        <a href="/assets/resume/CV_Ade_Rainhard_Pasaribu.pdf" download><span>Resume</span><strong>Download PDF</strong><Download aria-hidden="true" /></a>
      </nav>
    </div>
  );
}
