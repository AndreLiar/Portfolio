"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ResumeViewProps {
  data: any;
  lang: string;
  labels?: {
    printSavePdf?: string;
    downloadPdf?: string;
    downloading?: string;
    backToHome?: string;
    openInNewTab?: string;
  };
}

/** Normalize skill group: use .skills array or flatten .subcategories[].items for resume/PDF. */
function normalizeSkillGroup(skillGroup: any): { title: string; skills: string[] } {
  const title = skillGroup?.title ?? "";
  if (Array.isArray(skillGroup?.skills)) return { title, skills: skillGroup.skills };
  const skills: string[] = [];
  if (Array.isArray(skillGroup?.subcategories)) {
    for (const sub of skillGroup.subcategories) {
      if (Array.isArray(sub?.items)) skills.push(...sub.items);
    }
  }
  return { title, skills };
}

/** Strip all emoji from a string. */
function stripEmoji(str: string): string {
  return str
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/\uFE0F/g, "")
    .trim();
}

/** Strip HTML tags for ATS-friendly plain text, preserving list items as bullet lines. */
function htmlToPlainLines(html: string): { bullets: string[]; paragraphs: string[] } {
  const bullets: string[] = [];
  const paragraphs: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const text = stripEmoji(match[1].replace(/<[^>]+>/g, "").trim());
    if (text) bullets.push(text);
  }
  // Extract paragraph text (non-list content)
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  while ((match = pRegex.exec(html)) !== null) {
    const text = stripEmoji(match[1].replace(/<[^>]+>/g, "").trim());
    if (text) paragraphs.push(text);
  }
  // Fallback: if no structured content found, treat as paragraph
  if (bullets.length === 0 && paragraphs.length === 0) {
    const plain = stripEmoji(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    if (plain) paragraphs.push(plain);
  }
  return { bullets, paragraphs };
}

/** Parse the summary string into a clean intro paragraph and bullet items. */
function parseSummary(summary: string): { intro: string; bullets: string[] } {
  const lines = summary.split("\n").map((l) =>
    stripEmoji(l.replace(/\*\*/g, "").replace(/\*/g, "")).trim()
  ).filter((l) => l.length > 0);

  const intro: string[] = [];
  const bullets: string[] = [];

  for (const line of lines) {
    if (line.startsWith("•") || line.startsWith("-")) {
      bullets.push(line.replace(/^[•\-]\s*/, "").trim());
    } else {
      // Only add to intro if we haven't started bullets yet
      if (bullets.length === 0) {
        intro.push(line);
      }
    }
  }

  return { intro: intro.join(" "), bullets };
}

export function ResumeView({ data, lang, labels }: ResumeViewProps) {
  const handlePrint = () => window.print();

  const {
    name,
    fullName,
    title,
    location,
    contact,
    summary,
    resumeSkills,
    skills: rawSkills,
    workExperience,
    education,
    projects,
    languages,
    interests,
  } = data.data;

  const displayName = fullName || name;

  const normalizedSkills = useMemo(() => {
    const skillsToUse = resumeSkills || rawSkills;
    return Array.isArray(skillsToUse) ? skillsToUse.map(normalizeSkillGroup).filter((g: any) => g.skills.length > 0) : [];
  }, [rawSkills, resumeSkills]);

  const { intro: summaryIntro, bullets: summaryBullets } = useMemo(
    () => (summary ? parseSummary(summary) : { intro: "", bullets: [] }),
    [summary]
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-sans print:bg-white print:py-0">
      <div className="mx-auto max-w-[8.5in] px-4 print:max-w-full print:px-0">
        {/* Toolbar - Hidden in Print */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href={`/${lang}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            &larr; {labels?.backToHome ?? "Back to home"}
          </Link>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} className="bg-black text-white hover:bg-gray-800 border-none">
              {labels?.downloadPdf ?? "Download / Save CV"}
            </Button>
            <a
              href={`/${lang}/resume`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100 transition-colors text-black"
            >
              {labels?.openInNewTab ?? "Open in new tab"}
            </a>
          </div>
        </div>

        {/* Resume Document */}
        <div
          className="bg-white text-black shadow-xl print:shadow-none mx-auto overflow-hidden"
          id="resume-content"
          style={{ padding: "0.4in 0.6in", boxSizing: "border-box" }}
        >
          {/* ── Header ── */}
          <header className="text-center mb-3 pb-2 border-b-2 border-gray-300">
            <h1 className="text-2xl font-headline font-bold uppercase tracking-wider text-black mb-1">
              {displayName}
            </h1>
            <p className="text-[11px] font-medium text-gray-600">
              {[
                location ? stripEmoji(location) : null,
                contact?.email,
                contact?.phone && contact.phone !== "+33000000000" ? contact.phone : null,
                contact?.linkedin ? contact.linkedin.replace("https://www.linkedin.com/in/", "linkedin.com/in/") : null,
                contact?.github ? contact.github.replace("https://github.com/", "github.com/") : null,
              ]
                .filter(Boolean)
                .join("  |  ")}
            </p>
          </header>

          {/* ── Professional Summary ── */}
          {(summaryIntro || summaryBullets.length > 0) && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                Professional Summary
              </h2>
              {summaryIntro && (
                <p className="text-[11px] leading-snug mb-1 text-gray-800">
                  {summaryIntro}
                </p>
              )}
              {summaryBullets.length > 0 && (
                <ul className="list-disc pl-5 text-[11px] leading-snug text-gray-800 space-y-0.5">
                  {summaryBullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ── Experience ── */}
          {workExperience && workExperience.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                Experience
              </h2>
              <div className="space-y-2.5">
                {workExperience.map((job: any, index: number) => {
                  const { bullets, paragraphs } = htmlToPlainLines(job.description || "");
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-[12px] text-black">{job.title}</span>
                        <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap ml-4">{job.date}</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-700 mb-0.5">{job.subtitle}</div>
                      {paragraphs.length > 0 && paragraphs.map((p, idx) => (
                        <p key={`p-${idx}`} className="text-[11px] leading-snug text-gray-800 my-0.5">{p}</p>
                      ))}
                      {bullets.length > 0 && (
                        <ul className="list-disc pl-5 text-[11px] leading-snug text-gray-800 space-y-0.5 mt-0.5">
                          {bullets.map((point, idx) => {
                            const colonSplit = point.split(":");
                            if (colonSplit.length > 1 && colonSplit[0].length < 40) {
                              return (
                                <li key={idx}>
                                  <span className="font-bold">{colonSplit[0]}:</span>
                                  {colonSplit.slice(1).join(":")}
                                </li>
                              );
                            }
                            return <li key={idx}>{point}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Education ── */}
          {education && education.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu: any, index: number) => {
                  const { bullets, paragraphs } = htmlToPlainLines(edu.description || "");
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-[12px] text-black">{stripEmoji(edu.title)}</span>
                        <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap ml-4">{edu.date}</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-700 mb-0.5">{edu.subtitle}</div>
                      {paragraphs.length > 0 && paragraphs.map((p, idx) => (
                        <p key={`p-${idx}`} className="text-[11px] leading-snug text-gray-800 my-0.5">{p}</p>
                      ))}
                      {bullets.length > 0 && (
                        <ul className="list-disc pl-5 text-[11px] leading-snug text-gray-800 mt-0.5 space-y-0.5">
                          {bullets.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Technical Skills ── */}
          {normalizedSkills.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                Technical Skills
              </h2>
              <div className="space-y-0.5">
                {normalizedSkills.map((skillGroup, index) => (
                  <div key={index} className="text-[11px] text-gray-800 leading-snug">
                    <span className="font-bold text-black">{stripEmoji(skillGroup.title)}: </span>
                    <span>{skillGroup.skills.map(stripEmoji).join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Projects ── */}
          {projects && projects.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.slice(0, 2).map((project: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-[12px] text-black">{stripEmoji(project.title)}</span>
                      {project.link && (
                        <span className="text-[10px] font-medium text-gray-600">{project.link.replace("https://", "").replace(/\/$/, '')}</span>
                      )}
                    </div>
                    <p className="text-[11px] leading-snug text-gray-800 mb-0.5">{stripEmoji(project.purpose)}</p>
                    {project.features && project.features.length > 0 && (
                      <ul className="list-disc pl-5 text-[11px] leading-snug text-gray-800 space-y-0.5 mb-1">
                        {project.features.map((feature: string, idx: number) => {
                          const cleanFeature = stripEmoji(feature);
                          const colonIndex = cleanFeature.indexOf(":");
                          if (colonIndex > 0 && colonIndex < 40) {
                            return (
                              <li key={idx}>
                                <span className="font-bold">{cleanFeature.substring(0, colonIndex + 1)}</span>
                                {cleanFeature.substring(colonIndex + 1)}
                              </li>
                            );
                          }
                          return <li key={idx}>{cleanFeature}</li>;
                        })}
                      </ul>
                    )}
                    <p className="text-[11px] text-gray-800 mt-0.5">
                      <span className="font-bold text-black">Technologies: </span>
                      {project.stack.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Languages & Interests ── */}
          <div className="grid grid-cols-2 gap-4 mt-1">
            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                  Languages
                </h2>
                <div className="space-y-0.5">
                  {languages.map((l: any, index: number) => (
                    <div key={index} className="text-[11px] text-gray-800 flex justify-between max-w-[200px]">
                      <span>{l.name}</span>
                      <span className="font-medium text-gray-600">{l.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {interests && interests.length > 0 && (
              <section>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1.5">
                  Interests
                </h2>
                <p className="text-[11px] text-gray-800 leading-snug">
                  {interests.map(stripEmoji).join(", ")}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
