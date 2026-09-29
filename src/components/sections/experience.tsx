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
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                delay: shouldReduceMotion ? 0 : index * 0.08,
              }}
            >
              <Card className="border-white/10 bg-background/70 shadow-xl backdrop-blur-md transition-colors hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold md:text-2xl">
                        {experience.title}
                      </CardTitle>
                      <p className="font-medium text-muted-foreground">
                        {experience.company}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="w-fit font-mono font-normal"
                    >
                      {experience.startDate} — {experience.endDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="ml-5 list-disc space-y-2 text-muted-foreground marker:text-primary/70">
                    {experience.description.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((name) => {
                      const skill = SKILLS[name as SkillNames];
                      return (
                        <Badge
                          key={name}
                          variant="outline"
                          className="gap-2 bg-secondary/30 font-normal"
                        >
                          <img
                            src={skill.icon}
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                          />
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
              <Detail
                key={item.program}
                title={item.program}
                meta={item.institution}
                date={item.period}
              />
            ))}
          </InfoCard>
          <InfoCard title="Organizations">
            {ORGANIZATIONS.map((item) => (
              <Detail
                key={item.name}
                title={item.name}
                meta={item.role}
                date={item.period}
                body={item.description}
              />
            ))}
          </InfoCard>
          <InfoCard title="Certifications">
            {CERTIFICATIONS.map((item) => (
              <Detail
                key={item.title}
                title={item.title}
                meta={item.issuer}
                date={item.date}
              />
            ))}
          </InfoCard>
        </div>
      </div>
    </SectionWrapper>
  );
};

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="border-white/10 bg-background/70 backdrop-blur-md">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">{children}</CardContent>
  </Card>
);

const Detail = ({
  title,
  meta,
  date,
  body,
}: {
  title: string;
  meta?: string;
  date: string;
  body?: string;
}) => (
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
