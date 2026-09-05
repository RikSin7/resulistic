import { z } from "zod";

export const baseSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
});

export const experienceEntrySchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string()),
});

export const educationEntrySchema = z.object({
  institution: z.string(),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  details: z.string().optional(),
});

export const projectEntrySchema = z.object({
  name: z.string(),
  description: z.string(),
  techStack: z.array(z.string()).default([]),
  link: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const skillsEntrySchema = z.object({
  category: z.string(),
  items: z.array(z.string()).default([]),
});

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("experience"),
    entries: z.array(experienceEntrySchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("education"),
    entries: z.array(educationEntrySchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("projects"),
    entries: z.array(projectEntrySchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("skills"),
    entries: z.array(skillsEntrySchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("custom"),
    entries: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
]);

export const resumeSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  fullName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  sections: z.array(sectionSchema),
});

export type ResumeSection = z.infer<typeof sectionSchema>;
export type ResumeDocument = z.infer<typeof resumeSchema>;
