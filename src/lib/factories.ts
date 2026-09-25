import {
  type CustomEntry,
  type CustomSection,
  type EducationEntry,
  type ExperienceEntry,
  type ProjectEntry,
  type ResumeSection,
  type SkillEntry,
} from '@/lib/types'

// ============================================================
// Entry factories — create properly-shaped empty entries with
// fresh ids, ready to be added via store.addEntry().
// The UI components for each section type call the matching
// factory; the store never constructs entries itself.
// ============================================================

export function createExperienceEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    dates: { start: '', end: null },
    bullets: [],
  }
}

export function createEducationEntry(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    dates: { start: '', end: null },
  }
}

export function createProjectEntry(): ProjectEntry {
  return {
    id: crypto.randomUUID(),
    name: '',
    techStack: [],
    bullets: [],
  }
}

export function createSkillEntry(): SkillEntry {
  return {
    id: crypto.randomUUID(),
    category: '',
    items: [],
  }
}

export function createCustomEntry(): CustomEntry {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    bullets: [],
  }
}

// ============================================================
// Section factory — for the "Add Section" buttons.
// Fully type-safe: each case returns a valid section member,
// so no casts are needed.
// ============================================================

export function createSection(
  type: 'experience' | 'education' | 'projects' | 'skills' | 'custom'
): ResumeSection {
  const id = crypto.randomUUID()
  switch (type) {
    case 'experience':
      return { id, type: 'experience', title: 'Experience', entries: [] }
    case 'education':
      return { id, type: 'education', title: 'Education', entries: [] }
    case 'projects':
      return { id, type: 'projects', title: 'Projects', entries: [] }
    case 'skills':
      return { id, type: 'skills', title: 'Skills', entries: [] }
    case 'custom':
      return { id, type: 'custom', title: 'Achievements', entries: [] }
  }
}