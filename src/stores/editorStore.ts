import { create } from "zustand";
import {
  createEmptyResume,
  ResumeDocument,
  ResumeSection,
  Bullet,
  isBulletSection,
  ResumeEntry,
} from "@/lib/types";

interface EditorStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resume: ResumeDocument;
  isDirty: boolean;

  //Basic Setters
  setResume: (resume: ResumeDocument) => void;
  updateBasics: (basics: Partial<ResumeDocument["basics"]>) => void;

  //Section Setters
  addSection: (section: ResumeSection) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sectionId: string, direction: "up" | "down") => void;

  // Entry setters (any section type)
  addEntry: (sectionId: string, entry: ResumeEntry) => void
  replaceEntry: (sectionId: string, entry: ResumeEntry) => void
  removeEntry: (sectionId: string, entryId: string) => void
  reorderEntries: (sectionId: string, entryId: string, direction: 'up' | 'down') => void

  // Bullet actions (for experience/projects)
  addBullet: (sectionId: string, entryId: string, bulletText: string) => void;
  updateBullet: (
    sectionId: string,
    entryId: string,
    bulletId: string,
    bulletText: string,
  ) => void;
  removeBullet: (sectionId: string, entryId: string, bulletId: string) => void;

  //reset
  resetToEmpty: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  resume: createEmptyResume(),
  isDirty: false,

  setResume: (resume) => set({ resume, isDirty: false }),
  updateBasics: (basics) =>
    set((state) => ({
      resume: {
        ...state.resume,
        basics: { ...state.resume.basics, ...basics },
      },
      isDirty: true,
    })),
  addSection: (section) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: [...state.resume.sections, section],
      },
      isDirty: true,
    })),
  updateSectionTitle: (sectionId, title) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((s) =>
          s.id === sectionId ? { ...s, title } : s,
        ),
      },
      isDirty: true,
    })),
  removeSection: (sectionId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.filter((s) => s.id !== sectionId),
      },
      isDirty: true,
    })),
  reorderSections: (sectionId, direction) =>
    set((state) => {
      const index = state.resume.sections.findIndex((s) => s.id === sectionId);
      if (index === -1) return state; // Section not found

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= state.resume.sections.length)
        return state; // Out of bounds

      const newSections = [...state.resume.sections];
      [newSections[index], newSections[newIndex]] = [
        newSections[newIndex],
        newSections[index],
      ];

      return {
        resume: { ...state.resume, sections: newSections },
        isDirty: true,
      };
    }),

  // Entry Actions
  addEntry: (sectionId, entry) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        return { ...section, entries: [...section.entries, entry] } as ResumeSection
      })
      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  replaceEntry: (sectionId, entry) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        const entries = section.entries.map((e) => (e.id === entry.id ? entry : e))
        return { ...section, entries } as ResumeSection
      })
      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  removeEntry: (sectionId, entryId) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        const entries = section.entries.filter((e) => e.id !== entryId)
        return { ...section, entries } as ResumeSection
      })
      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  reorderEntries: (sectionId, entryId, direction) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section

        const index = section.entries.findIndex((e) => e.id === entryId)
        if (index === -1) return section
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= section.entries.length) return section

        const newEntries = [...section.entries]
          ;[newEntries[index], newEntries[newIndex]] = [newEntries[newIndex], newEntries[index]]
        return { ...section, entries: newEntries } as ResumeSection
      })
      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  addBullet: (sectionId, entryId, bulletText) =>
    set((state) => {
      const newBullet: Bullet = { id: crypto.randomUUID(), text: bulletText }

      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        if (!isBulletSection(section)) return section

        const entries = section.entries.map((entry) =>
          entry.id === entryId
            ? { ...entry, bullets: [...entry.bullets, newBullet] }
            : entry
        )
        return { ...section, entries } as ResumeSection
      })

      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  updateBullet: (sectionId, entryId, bulletId, bulletText) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        if (!isBulletSection(section)) return section

        const entries = section.entries.map((entry) => {
          if (entry.id !== entryId) return entry
          const bullets = entry.bullets.map((b) =>
            b.id === bulletId ? { ...b, text: bulletText } : b
          )
          return { ...entry, bullets }
        })
        return { ...section, entries } as ResumeSection
      })

      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  removeBullet: (sectionId, entryId, bulletId) =>
    set((state) => {
      const sections: ResumeSection[] = state.resume.sections.map((section) => {
        if (section.id !== sectionId) return section
        if (!isBulletSection(section)) return section

        const entries = section.entries.map((entry) =>
          entry.id === entryId
            ? { ...entry, bullets: entry.bullets.filter((b) => b.id !== bulletId) }
            : entry
        )
        return { ...section, entries } as ResumeSection
      })

      return { isDirty: true, resume: { ...state.resume, sections } }
    }),

  resetToEmpty: () => set({ resume: createEmptyResume(), isDirty: false }),
}));
