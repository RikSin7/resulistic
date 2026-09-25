"use client";

import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa";
import { useEditorStore } from "@/stores/editorStore";
import {
  createCustomEntry,
  createEducationEntry,
  createExperienceEntry,
  createProjectEntry,
  createSection,
  createSkillEntry,
} from "@/lib/factories";
import type {
  Bullet,
  CustomSection,
  EducationSection,
  ExperienceSection,
  ProjectSection,
  SkillsSection,
  SkillEntry,
  CustomEntry,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
} from "@/lib/types";

// ---------- shared primitives ----------

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}

function BulletList({
  sectionId,
  entryId,
  bullets,
}: {
  sectionId: string;
  entryId: string;
  bullets: Bullet[];
}) {
  const addBullet = useEditorStore((s) => s.addBullet);
  const updateBullet = useEditorStore((s) => s.updateBullet);
  const removeBullet = useEditorStore((s) => s.removeBullet);

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-gray-600">
        Bullets
      </span>
      {bullets.map((b) => (
        <div key={b.id} className="mb-1 flex items-start gap-2">
          <textarea
            value={b.text}
            rows={2}
            onChange={(e) =>
              updateBullet(sectionId, entryId, b.id, e.target.value)
            }
            placeholder="Built and shipped X, resulting in Y%"
            className="flex-1 rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeBullet(sectionId, entryId, b.id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            title="Remove bullet"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addBullet(sectionId, entryId, "")}
        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
      >
        <FaPlus size={10} /> Add bullet
      </button>
    </div>
  );
}

function EntryActions({
  sectionId,
  entryId,
  index,
  total,
}: {
  sectionId: string;
  entryId: string;
  index: number;
  total: number;
}) {
  const removeEntry = useEditorStore((s) => s.removeEntry);
  const reorderEntries = useEditorStore((s) => s.reorderEntries);

  return (
    <div className="mt-2 flex justify-end gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => reorderEntries(sectionId, entryId, "up")}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
        title="Move up"
      >
        <FaArrowUp size={12} />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => reorderEntries(sectionId, entryId, "down")}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
        title="Move down"
      >
        <FaArrowDown size={12} />
      </button>
      <button
        type="button"
        onClick={() => removeEntry(sectionId, entryId)}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        title="Remove entry"
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
}

// ---------- per-section editors ----------

function ExperienceEditor({ section }: { section: ExperienceSection }) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const replaceEntry = useEditorStore((s) => s.replaceEntry);
  const replace = (entry: ExperienceEntry) => replaceEntry(section.id, entry);

  return (
    <div className="space-y-3">
      {section.entries.map((entry, i) => (
        <div key={entry.id} className="rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Company"
              value={entry.company}
              placeholder="Google"
              onChange={(v) => replace({ ...entry, company: v })}
            />
            <Field
              label="Role"
              value={entry.role}
              placeholder="Software Engineer"
              onChange={(v) => replace({ ...entry, role: v })}
            />
            <Field
              label="Start"
              value={entry.dates.start}
              placeholder="Jan 2024"
              onChange={(v) =>
                replace({ ...entry, dates: { ...entry.dates, start: v } })
              }
            />
            <Field
              label="End (empty = Present)"
              value={entry.dates.end ?? ""}
              onChange={(v) =>
                replace({ ...entry, dates: { ...entry.dates, end: v || null } })
              }
            />
          </div>
          <div className="mt-3">
            <BulletList
              sectionId={section.id}
              entryId={entry.id}
              bullets={entry.bullets}
            />
          </div>
          <EntryActions
            sectionId={section.id}
            entryId={entry.id}
            index={i}
            total={section.entries.length}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section.id, createExperienceEntry())}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <FaPlus size={11} /> Add experience
      </button>
    </div>
  );
}

function EducationEditor({ section }: { section: EducationSection }) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const replaceEntry = useEditorStore((s) => s.replaceEntry);
  const replace = (entry: EducationEntry) => replaceEntry(section.id, entry);

  return (
    <div className="space-y-3">
      {section.entries.map((entry, i) => (
        <div key={entry.id} className="rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Institution"
              value={entry.institution}
              placeholder="IIT Delhi"
              onChange={(v) => replace({ ...entry, institution: v })}
            />
            <Field
              label="Degree"
              value={entry.degree}
              placeholder="B.Tech"
              onChange={(v) => replace({ ...entry, degree: v })}
            />
            <Field
              label="Field"
              value={entry.field ?? ""}
              placeholder="Computer Science"
              onChange={(v) => replace({ ...entry, field: v || undefined })}
            />
            <Field
              label="Start"
              value={entry.dates.start}
              placeholder="2020"
              onChange={(v) =>
                replace({ ...entry, dates: { ...entry.dates, start: v } })
              }
            />
            <Field
              label="End (empty = Present)"
              value={entry.dates.end ?? ""}
              onChange={(v) =>
                replace({ ...entry, dates: { ...entry.dates, end: v || null } })
              }
            />
          </div>
          <div className="mt-3">
            <Field
              label="Details"
              value={entry.details ?? ""}
              placeholder="CGPA: 8.5"
              onChange={(v) => replace({ ...entry, details: v || undefined })}
            />
          </div>
          <EntryActions
            sectionId={section.id}
            entryId={entry.id}
            index={i}
            total={section.entries.length}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section.id, createEducationEntry())}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <FaPlus size={11} /> Add education
      </button>
    </div>
  );
}

function SkillsEditor({ section }: { section: SkillsSection }) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const replaceEntry = useEditorStore((s) => s.replaceEntry);
  const replace = (entry: SkillEntry) => replaceEntry(section.id, entry);

  return (
    <div className="space-y-3">
      {section.entries.map((entry, i) => (
        <div key={entry.id} className="rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Category"
              value={entry.category}
              placeholder="Languages"
              onChange={(v) => replace({ ...entry, category: v })}
            />
            <Field
              label="Items (comma separated)"
              value={entry.items.join(", ")}
              placeholder="TypeScript, Python, Go"
              onChange={(v) =>
                replace({ ...entry, items: v.split(",").map((s) => s.trim()) })
              }
            />
          </div>
          <EntryActions
            sectionId={section.id}
            entryId={entry.id}
            index={i}
            total={section.entries.length}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section.id, createSkillEntry())}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <FaPlus size={11} /> Add skill category
      </button>
    </div>
  );
}

function ProjectsEditor({ section }: { section: ProjectSection }) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const replaceEntry = useEditorStore((s) => s.replaceEntry);
  const replace = (entry: ProjectEntry) => replaceEntry(section.id, entry);

  return (
    <div className="space-y-3">
      {section.entries.map((entry, i) => (
        <div key={entry.id} className="rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Project name"
              value={entry.name}
              placeholder="Resulistic"
              onChange={(v) => replace({ ...entry, name: v })}
            />
            <Field
              label="Link"
              value={entry.link ?? ""}
              placeholder="https://github.com/..."
              onChange={(v) => replace({ ...entry, link: v || undefined })}
            />
            <Field
              label="Tech stack (comma separated)"
              value={entry.techStack.join(", ")}
              placeholder="Next.js, MongoDB, Gemini"
              onChange={(v) =>
                replace({
                  ...entry,
                  techStack: v.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <Field
              label="Description"
              value={entry.description ?? ""}
              textarea
              onChange={(v) =>
                replace({ ...entry, description: v || undefined })
              }
            />
          </div>
          <div className="mt-3">
            <BulletList
              sectionId={section.id}
              entryId={entry.id}
              bullets={entry.bullets}
            />
          </div>
          <EntryActions
            sectionId={section.id}
            entryId={entry.id}
            index={i}
            total={section.entries.length}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section.id, createProjectEntry())}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <FaPlus size={11} /> Add project
      </button>
    </div>
  );
}

function CustomEditor({ section }: { section: CustomSection }) {
  const addEntry = useEditorStore((s) => s.addEntry);
  const replaceEntry = useEditorStore((s) => s.replaceEntry);
  const replace = (entry: CustomEntry) => replaceEntry(section.id, entry);

  return (
    <div className="space-y-3">
      {section.entries.map((entry, i) => (
        <div key={entry.id} className="rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Title"
              value={entry.title}
              placeholder="AWS Solutions Architect"
              onChange={(v) => replace({ ...entry, title: v })}
            />
            <Field
              label="Subtitle"
              value={entry.subtitle ?? ""}
              placeholder="Amazon Web Services"
              onChange={(v) => replace({ ...entry, subtitle: v || undefined })}
            />
          </div>
          <div className="mt-3">
            <Field
              label="Description"
              value={entry.description ?? ""}
              textarea
              onChange={(v) =>
                replace({ ...entry, description: v || undefined })
              }
            />
          </div>
          <div className="mt-3">
            <BulletList
              sectionId={section.id}
              entryId={entry.id}
              bullets={entry.bullets}
            />
          </div>
          <EntryActions
            sectionId={section.id}
            entryId={entry.id}
            index={i}
            total={section.entries.length}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry(section.id, createCustomEntry())}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <FaPlus size={11} /> Add entry
      </button>
    </div>
  );
}

// ---------- the main component ----------

export default function SectionEditor() {
  const sections = useEditorStore((s) => s.resume.sections);
  const updateSectionTitle = useEditorStore((s) => s.updateSectionTitle);
  const removeSection = useEditorStore((s) => s.removeSection);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const addSection = useEditorStore((s) => s.addSection);

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <section key={section.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <input
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="flex-1 rounded border px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              disabled={i === 0}
              onClick={() => reorderSections(section.id, "up")}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              title="Move section up"
            >
              <FaArrowUp size={12} />
            </button>
            <button
              type="button"
              disabled={i === sections.length - 1}
              onClick={() => reorderSections(section.id, "down")}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              title="Move section down"
            >
              <FaArrowDown size={12} />
            </button>
            <button
              type="button"
              onClick={() => removeSection(section.id)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              title="Delete section"
            >
              <FaTrash size={12} />
            </button>
          </div>

          {section.type === "experience" && (
            <ExperienceEditor section={section} />
          )}
          {section.type === "education" && (
            <EducationEditor section={section} />
          )}
          {section.type === "skills" && <SkillsEditor section={section} />}
          {section.type === "projects" && <ProjectsEditor section={section} />}
          {section.type === "custom" && <CustomEditor section={section} />}
        </section>
      ))}

      <div className="flex flex-wrap gap-2 border-t pt-4">
        {(
          ["experience", "education", "projects", "skills", "custom"] as const
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => addSection(createSection(t))}
            className="rounded-full border px-3 py-1 text-xs capitalize text-gray-600 hover:border-blue-400 hover:text-blue-600"
          >
            + {t === "custom" ? "custom (achievements, certs…)" : t}
          </button>
        ))}
      </div>
    </div>
  );
}
