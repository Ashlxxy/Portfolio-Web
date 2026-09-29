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

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : Math.min(index, 3) * 0.06,
      }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-white/10 bg-background/75 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-primary/5 motion-reduce:transform-none motion-reduce:transition-none">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/5 font-mono text-[10px] uppercase tracking-wider"
              >
                {project.category}
              </Badge>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {project.title}
              </CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="w-fit shrink-0 font-mono font-normal"
            >
              {project.period}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-6">
          <p className="leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground marker:text-primary/70">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="mt-auto space-y-5 pt-2">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <Badge
                  key={technology}
                  variant="secondary"
                  className="bg-secondary/55 font-normal"
                >
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
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
