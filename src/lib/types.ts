import { z } from "zod";

// lib/types.ts — the data shape (app layer)
// This file defines what a resume looks like — its structure, fields, and types. It uses Zod, which gives you two things in one file:

// Runtime validation — when data comes in (from an LLM, from a file upload, from the user), you run it through resumeSchema.parse(data). If the data doesn't match the shape, it throws. This is your safety net against malformed LLM output.
// TypeScript types — export type ResumeDocument = z.infer<typeof resumeSchema> generates the TS type automatically from the schema. You don't write interfaces by hand. The schema is the single source of truth for both validation and types.

// ============================================================
// The single source of truth for the ResumeDocument.
// Everything imports from here: API routes, Zustand store,
// LLM output validation, PDF renderer, ATS scorer.
// ============================================================

// ---------- Basics ----------
const LinkSchema = z.object({
  id: z.string(),
  label: z.string(),        // "GitHub", "LinkedIn", "Portfolio"
  url: z.url(),
})

const BasicsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),     // "Jaipur, India"
  links: z.array(LinkSchema).default([]),
})

// ---------- Shared ----------
const DateRangeSchema = z.object({
  start: z.string(),       // "Jan 2024" — keep as string for display flexibility
  end: z.string().nullable(), // null = present
})

const BulletSchema = z.object({
  id: z.string(),
  text: z.string(),
})

// ---------- Experience ----------
const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  dates: DateRangeSchema,
  bullets: z.array(BulletSchema).default([]),
})

export const ExperienceSectionSchema = z.object({
  id: z.string(),
  type: z.literal('experience'),
  title: z.string().default('Experience'),
  entries: z.array(ExperienceEntrySchema).default([]),
})

// ---------- Education ----------
const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),      // "B.Tech"
  field: z.string().optional(),   // "Computer Science"
  dates: DateRangeSchema,
  details: z.string().optional(), // "CGPA: 8.5"
})

export const EducationSectionSchema = z.object({
  id: z.string(),
  type: z.literal('education'),
  title: z.string().default('Education'),
  entries: z.array(EducationEntrySchema).default([]),
})

// ---------- Projects ----------
const ProjectEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  link: z.url().optional(),
  bullets: z.array(BulletSchema).default([]),
})

export const ProjectSectionSchema = z.object({
  id: z.string(),
  type: z.literal('projects'),
  title: z.string().default('Projects'),
  entries: z.array(ProjectEntrySchema).default([]),
})

// ---------- Skills ----------
const SkillEntrySchema = z.object({
  id: z.string(),
  category: z.string(),    // "Languages", "Frameworks", "Tools"
  items: z.array(z.string()).default([]),
})

export const SkillsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('skills'),
  title: z.string().default('Skills'),
  entries: z.array(SkillEntrySchema).default([]),
})

// ---------- Custom ----------
const CustomEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
})

export const CustomSectionSchema = z.object({
  id: z.string(),
  type: z.literal('custom'),
  title: z.string().default('Custom'),
  entries: z.array(CustomEntrySchema).default([]),
})

// ---------- The discriminated union ----------
export const ResumeSectionSchema = z.discriminatedUnion('type', [
  ExperienceSectionSchema,
  EducationSectionSchema,
  ProjectSectionSchema,
  SkillsSectionSchema,
  CustomSectionSchema,
])

// ---------- Meta ----------
const ResumeMetaSchema = z.object({
  template: z.string().default('ats-clean'),
  accentColor: z.string().default('#1a1a1a'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
})

// ---------- The full ResumeDocument (actual resume content, not the mongoDB document itself) ----------
export const ResumeSchema = z.object({
  title: z.string().default('Untitled Resume'),
  basics: BasicsSchema,
  sections: z.array(ResumeSectionSchema).default([]),
  meta: ResumeMetaSchema,
})

// ---------- Derived TypeScript types ----------
// These are what you import across the app. The schema is the
// source of truth; the types are inferred from it — no duplicate
// type definitions.

export type Link = z.infer<typeof LinkSchema>
export type Basics = z.infer<typeof BasicsSchema>
export type DateRange = z.infer<typeof DateRangeSchema>
export type Bullet = z.infer<typeof BulletSchema>

export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>
export type EducationEntry = z.infer<typeof EducationEntrySchema>
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>
export type SkillEntry = z.infer<typeof SkillEntrySchema>
export type CustomEntry = z.infer<typeof CustomEntrySchema>

export type ExperienceSection = z.infer<typeof ExperienceSectionSchema>
export type EducationSection = z.infer<typeof EducationSectionSchema>
export type ProjectSection = z.infer<typeof ProjectSectionSchema>
export type SkillsSection = z.infer<typeof SkillsSectionSchema>
export type CustomSection = z.infer<typeof CustomSectionSchema>

export type ResumeSection = z.infer<typeof ResumeSectionSchema>
export type ResumeDocument = z.infer<typeof ResumeSchema>

// ============================================================
// AI SUGGESTION SCHEMA
// Used by the tailor endpoint. LLM returns these; the app
// validates + applies them. AI never mutates state directly.
// ============================================================

const SuggestionTargetSchema = z.object({
  sectionId: z.string(),
  entryId: z.string().optional(),      // which experience/education/project entry
  bulletId: z.string().optional(),     // if targeting a specific bullet
})

export const SuggestionSchema = z.object({
  id: z.string(),
  type: z.enum(['rewrite', 'add', 'remove']),
  target: SuggestionTargetSchema,
  current: z.string().optional(),       // current text (for rewrite/remove)
  suggested: z.string(),               // new text or the text to add
  reason: z.string(),                  // why this change helps match the JD
  factCheckWarning: z.boolean().default(false), // flagged by fact-checker
})

export type Suggestion = z.infer<typeof SuggestionSchema>

// ============================================================
// ATS SCORECARD SCHEMA
// Returned by the scorer. Mostly deterministic checks; only
// keyword overlap uses the LLM.
// ============================================================

const AtsCheckSchema = z.object({
  name: z.string(),                     // "Text extractability"
  passed: z.boolean(),
  score: z.number(),                    // points earned for this check
  maxScore: z.number(),
  detail: z.string(),                   // human-readable explanation
})

export const ScorecardSchema = z.object({
  overallScore: z.number(),             // sum of all check scores
  checks: z.array(AtsCheckSchema),
  keywordOverlap: z
    .object({
      matched: z.array(z.string()),
      missing: z.array(z.string()),
    })
    .optional(),
})

export type AtsCheck = z.infer<typeof AtsCheckSchema>
export type Scorecard = z.infer<typeof ScorecardSchema>

// ============================================================
// HELPER: Create an empty resume (useful for "Create Resume" flow)
// ============================================================

export function createEmptyResume(): ResumeDocument {
  return ResumeSchema.parse({
    title: 'Untitled Resume',
    basics: {
      name: '',
      email: '',
      links: [],
    },
    sections: [
      {
        id: crypto.randomUUID(),
        type: 'experience',
        title: 'Experience',
        entries: [],
      },
      {
        id: crypto.randomUUID(),
        type: 'education',
        title: 'Education',
        entries: [],
      },
      {
        id: crypto.randomUUID(),
        type: 'skills',
        title: 'Skills',
        entries: [],
      },
    ],
    meta: {
      template: 'ats-clean',
      accentColor: '#1a1a1a',
      fontSize: 'medium',
    },
  })
}