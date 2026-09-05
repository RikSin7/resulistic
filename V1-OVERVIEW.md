# Resulistic — V1 Overview

> **One-liner:** Upload your resume → paste a JD → AI tailors it with per-edit accept/reject → export an ATS-clean PDF → see a live ATS scorecard.
>
> **Tagline:** Don't just build a resume. Grade it.

---

## 1. Why this exists

AI resume builders are everywhere, but most are shallow — they generate text and call it a day. Resulistic's differentiator is **depth**: a real ATS scorer that re-parses your own rendered PDF, structured LLM output validated against a typed schema, and a per-edit accept/reject tailoring flow instead of blind overwrites.

This is both a product (used for an active job hunt) and a portfolio artifact. The ATS scorer's methodology writeup is the senior signal — it shows you understand LLM features in production, not just prompt tinkering.

---

## 2. V1 Scope

### In scope (17 features)

**CORE**
- [ ] Create resume
- [ ] Edit resume
- [ ] Add / Remove / Reorder section
- [ ] Live preview
- [ ] Overflow detection
- [ ] Pagination
- [ ] PDF export

**AI LAYER**
- [ ] JD input
- [ ] JD analysis
- [ ] Resume analysis
- [ ] Resume/JD matching
- [ ] Improvement suggestions
- [ ] Accept/reject changes

**QUALITY CHECK**
- [ ] Compatibility checker (ATS scorer)
- [ ] Resume linting basics
- [ ] Before/after diff
- [ ] Basic fact grounding (flag suggestions that introduce new metrics/tech not in resume or JD)

**IMPORT**
- [ ] PDF import
- [ ] DOCX import

### Explicitly out of V1 (moved to V2)
- Multiple templates (V1 ships **one** ATS-clean template)
- Custom sections
- 1/2 page mode toggle (replaced by overflow detection + warning)
- Custom AI instructions (freeform "update my tech stack")
- AI add/remove/update section (folded into suggestion stream)
- Versioning (V1 auto-saves only)
- Sophisticated fact grounding layer (V1 has a basic entity check; full factual database is V2)
- Cover letter
- Application tracker

---

## 3. Tech Stack

| Concern | Package | Why |
|---|---|---|
| Framework | `next@16` + `react@19` | Fullstack App Router. No separate Express backend. |
| Auth | `next-auth@5-beta` | OAuth, sessions, server actions. |
| DB | `mongoose@8` | MongoDB ODM. Compatible with the auth adapter (both use mongodb@6). |
| Auth→DB bridge | `@auth/mongodb-adapter` | Stores users/sessions in MongoDB. |
| Validation | `zod@4` | Runtime schema validation. Single source of truth for the Resume type. LLM safety net. |
| Client state | `zustand` | Editor state (resume draft, suggestions, ATS score). Avoids Context re-render storms. |
| LLM | `@google/genai` | Gemini free tier for tailoring + parsing + keyword analysis. |
| PDF parsing | `pdf-parse` | Read uploaded PDF resumes. |
| DOCX parsing | `mammoth` | Read uploaded Word resumes. |
| PDF generation | `@react-pdf/renderer` | ATS-clean PDF export. Real selectable text, not canvas/image. |
| Styling utils | `clsx` + `tailwind-merge` | Conditional Tailwind classes. |
| Icons | `react-icons` | UI icons. |
| Markdown | `react-markdown` | Render AI suggestions/explanations. |

### Key architectural decisions
- **No Express.** Everything runs in Next.js (API routes + server actions + server components).
- **Business logic lives in `lib/`.** Route handlers are thin wrappers — the logic is portable if you ever extract to Express.

---

## 4. The Central Object: `Resume`

Everything keys off one typed JSON document. It lives in MongoDB, lives in Zustand during editing, is what the LLM reads/writes, what the ATS scorer parses, and what the PDF renderer renders.

**ResumeDocument is the source of truth.** The PDF renderer is the source of truth for *what the user exports and what you score* — but the document itself is the truth, the PDF is a projection of it.

```
ResumeDocument
     ↓
Renderer
     ├── Live preview (HTML)
     └── PDF export
              ↓
         ATS re-parse (score what you export)
```

### Typed sections (discriminated union)

Sections are **not** uniform. Experience, education, projects, and skills have substantially different structures. Use a discriminated union so each section type has its own typed shape:

```typescript
type ResumeSection =
  | ExperienceSection    // { type: 'experience', entries: [{ company, role, startDate, endDate, bullets[] }] }
  | EducationSection     // { type: 'education', entries: [{ institution, degree, field, startDate, endDate, details }] }
  | ProjectSection       // { type: 'projects', entries: [{ name, description, techStack[], link, bullets[] }] }
  | SkillsSection        // { type: 'skills', entries: [{ category, items[] }] }
  | CustomSection;       // { type: 'custom', entries: [{ title, description }] }
```

This gives you:
- Type safety in the editor (different form fields per section type)
- Better LLM prompts (the schema tells Gemini exactly what each field means)
- Cleaner PDF rendering (each section type renders differently)

---

## 5. Database Schema (MongoDB)

Two collections only.

### `users` (managed by @auth/mongodb-adapter)
```
_id, name, email, image, emailVerified
```

### `resumes`
```
_id              — ObjectId
userId           — ref to users
title            — String ("Software Engineer - Google")
content          — Schema.Types.Mixed (the full Resume JSON object)
sourceJd         — String or null
atsScore         — Object or null (last computed scorecard)
createdAt        — Date (auto)
updatedAt        — Date (auto)
```

One user → many resumes. Each resume is one document. No sub-collections, no normalization.

---

## 6. The Three User Journeys

### Journey 1: Import & Edit (no AI)
```
Sign in
  → Upload PDF/DOCX
  → Parser extracts raw text (pdf-parse / mammoth)
  → LLM structures text into Resume object (one-time parse call)
  → Zod validates the structure
  → Saved to MongoDB
  → Loads into Zustand editor store
  → Edit via form (add/remove/reorder sections, edit bullets)
  → Live preview updates in real time
  → Auto-saves to MongoDB (debounced)
  → Export → @react-pdf/renderer generates ATS-clean PDF
```

### Journey 2: Tailor to JD (the AI core loop)
```
Resume is open in editor
  → Paste JD into the JD panel
  → POST { resume, jd } to /api/tailor
  → Gemini returns structured Suggestion[]
  → Suggestions render in a side panel
  → Click Accept on a suggestion
  → Zustand store updates the resume (diff shown: red strike / green add)
  → Live preview + ATS score re-render
  → Can Reject to revert
  → Auto-saves the updated resume
```

### Journey 3: ATS Score (the quality loop)
```
Editing (with or without JD)
  → Click "Check ATS Score" (or auto-runs, debounced)
  → App renders resume to PDF in-memory (server-side)
  → ATS scorer parses the rendered PDF back
  → Scorer runs checks:
      - text extractability
      - section heading recognition
      - date format consistency & parseability
      - contact block present & parseable
      - no text-in-image, no multi-column traps
      - keyword overlap with JD (LLM call)
  → Returns a scorecard: { overallScore, checks: [{ name, passed, score, detail }] }
  → Scorecard renders beside the preview
  → Score updates live as you fix flagged issues
```

---

## 7. API Surface

| Endpoint | Type | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | NextAuth route | Auth (login, logout, session) |
| `/api/parse-resume` | POST | Receives file upload, extracts text, calls LLM to structure into Resume |
| `/api/tailor` | POST | Sends { resume, jd } to Gemini, returns structured Suggestion[] |
| `/api/ats-score` | POST | Receives resume (+ optional JD), renders PDF, scores it, returns scorecard |
| `saveResume()` | Server Action | Saves Zustand state to MongoDB (debounced, from client) |
| `getResume()` | Server Action | Loads a resume from MongoDB (in server component) |

---

## 8. LLM Calls (3 distinct prompts)

### Call 1: Parse (Journey 1)
- **Input:** raw text from PDF/DOCX
- **Output:** Resume object (Zod-validated JSON)
- **Prompt intent:** "Extract and structure this resume into the following JSON schema…"

### Call 2: Tailor (Journey 2)
- **Input:** `{ resume, jd }`
- **Output:** `Suggestion[]` (Zod-validated JSON)
- **Prompt intent:** "Compare this resume to this JD. Return specific, actionable suggestions. Each must have a target, current text, suggested text, and reason. Do not invent experience."
- **Guardrail:** AI edits are scoped to *existing* content (rewrite, don't invent). The diff view lets the user catch hallucinations manually.

### Call 3: Keyword analysis (Journey 3)
- **Input:** `{ resume, jd }`
- **Output:** `{ keywordOverlap, missingKeywords, matchedKeywords }`
- **Prompt intent:** "Extract key skills and terms from this JD. Match against the resume."
- **Note:** Only the keyword analysis uses the LLM. The structural ATS checks (text extractability, section detection, dates, contact) are deterministic code run on the re-parsed PDF.

---

## 9. Zustand Store (Client State)

```
EditorStore
├── resume: Resume                    ← working copy
├── suggestions: Suggestion[]         ← LLM suggestions from JD analysis
├── atsScore: Scorecard | null        ← last computed ATS score
├── activeSectionId: string | null    ← which section is being edited
├── isDirty: boolean                  ← has unsaved changes
│
├── updateBullet(sectionId, bulletId, text)
├── addSection(type)
├── removeSection(id)
├── reorderSection(id, direction)
├── acceptSuggestion(suggestionId)    ← applies suggestion to resume
├── rejectSuggestion(suggestionId)
├── setResume(resume)                 ← load from DB
├── setSuggestions(suggestions)
├── setAtsScore(score)
```

**Auto-save:** Zustand state changes → wait 1.5s of inactivity → call `saveResume` server action. No save button. A subtle "Saving… → Saved" indicator shows `isDirty` state.

---

## 10. Folder Structure

```
resulistic/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts     # NextAuth route handler
│   │   ├── parse-resume/route.ts          # File upload → text → Resume object
│   │   ├── tailor/route.ts                # { resume, jd } → Suggestion[]
│   │   └── ats-score/route.ts             # Resume → rendered PDF → scorecard
│   ├── editor/
│   │   └── page.tsx                        # Editor page (server component loads resume)
│   ├── dashboard/
│   │   └── page.tsx                        # List of user's resumes
│   ├── page.tsx                            # Landing page
│   └── layout.tsx                          # Root layout + SessionProvider
├── components/
│   ├── editor/
│   │   ├── ResumeEditor.tsx                # Structured form editor
│   │   ├── SectionEditor.tsx               # Per-section add/remove/reorder
│   │   └── BulletEditor.tsx                # Inline bullet text editing
│   ├── preview/
│   │   └── ResumePreview.tsx               # Live HTML preview
│   ├── ai/
│   │   ├── JdInput.tsx                      # JD paste panel
│   │   ├── SuggestionPanel.tsx             # List of suggestions w/ accept/reject
│   │   └── DiffView.tsx                     # Git-style red/green diff
│   ├── quality/
│   │   └── AtsScorecard.tsx                 # ATS score breakdown
│   ├── pdf/
│   │   └── ResumePDF.tsx                    # @react-pdf/renderer template
│   └── ui/                                  # Shared primitives (Button, Dialog, etc.)
├── lib/
│   ├── types.ts                             # Zod resume schema + derived types ← START HERE
│   ├── mongo.ts                             # Mongoose connection (cached)
│   ├── auth.ts                              # NextAuth v5 config
│   ├── models/
│   │   └── Resume.ts                        # Mongoose model
│   ├── llm/
│   │   ├── provider.ts                      # AIProvider interface (abstraction seam for future OpenAI/Ollama)
│   │   ├── gemini.ts                        # GeminiProvider implementation
│   │   ├── parse.ts                         # Text → Resume object (via provider)
│   │   ├── tailor.ts                        # { resume, jd } → Suggestion[] (via provider)
│   │   ├── keywords.ts                      # Keyword overlap analysis (via provider)
│   │   └── fact-check.ts                    # Basic entity check: flags suggestions introducing new metrics/tech
│   ├── parser.ts                            # pdf-parse + mammoth wrappers
│   └── scorer.ts                            # ATS scoring logic (code, not LLM)
├── stores/
│   └── editorStore.ts                       # Zustand store
├── .env.local
└── package.json
```

---

## 11. Build Sequence (phased)

### Phase 0: Schema — `lib/types.ts`
The Zod resume schema (with discriminated union sections) + derived TS types. Everything depends on this. **Build first.**

### Phase 1: Editor + Preview (the core document system)
- Zustand store
- Structured form editor (sections, bullets, add/remove/reorder)
- Live HTML preview component
- Mock data (no DB yet — hardcode a sample resume)
- **Test:** edit a bullet, see preview update in real time

### Phase 2: Renderer + Pagination / Overflow
- `@react-pdf/renderer` template (one ATS-clean template)
- Export button → generates PDF → downloads
- Page overflow detection (render → count pages → warn if content exceeds target)
- **Test:** export matches preview, PDF has selectable text, overflow warning fires correctly

### Phase 3: Persistence + Auth
- MongoDB connection (`lib/mongo.ts`)
- Mongoose Resume model (`lib/models/Resume.ts`)
- NextAuth v5 config (`lib/auth.ts`)
- Protected routes
- Auto-save (debounced server action)
- **Test:** sign in, edit a bullet, refresh page, data persists

### Phase 4: Parse & Import
- `/api/parse-resume` route
- `pdf-parse` + `mammoth` text extraction
- LLM call to structure text → Resume object (via AIProvider abstraction)
- Zod validation + retry on failure
- AIProvider interface + GeminiProvider implementation (abstraction seam for future providers)
- **Test:** upload a real resume, see it structured in the editor

### Phase 5: JD Tailoring (the AI core loop)
- `/api/tailor` route
- JD input panel
- LLM returns structured suggestions (via provider)
- Suggestion panel with accept/reject
- Diff view on accept
- Basic fact grounding: flag suggestions that introduce new metrics/tech not in resume or JD
- **Test:** paste a JD, get suggestions, accept 2, see diff, see flagged hallucinations

### Phase 6: ATS Scorer
- Render resume to PDF in-memory (server-side, using same renderer from Phase 2)
- Re-parse the rendered PDF
- Run structural checks (text extractability, sections, dates, contact)
- Keyword overlap with JD (LLM call)
- Return scorecard
- ATS score re-runs after changes
- **Test:** score changes when you fix a flagged issue

### Phase 7: Polish
- Resume linting basics (action verbs, quantification hints)
- Before/after diff view (improved)
- Empty states, loading states, error handling
- **Test:** full end-to-end flow with a real resume + real JD

---

## 12. Key Design Principles

1. **ResumeDocument = source of truth.** The typed JSON document is the truth. The renderer (HTML preview + PDF export) is a projection of it. The ATS scorer re-parses the rendered PDF to verify what an ATS would see — you score what you export, using the same renderer.

2. **Sections are typed (discriminated union).** Experience, education, projects, skills have different structures. Each section type has its own typed shape. This gives type safety in the editor, better LLM prompts, and cleaner rendering.

3. **AI = proposes structured patches. App = validates + applies them.** Every Gemini call returns JSON validated against a Zod schema. If validation fails, retry (max 2 retries). The AI never directly mutates state — it proposes, the app applies.

4. **Renderer controls layout. AI never controls layout.** The AI generates content (text, bullets, suggestions). The renderer handles pagination, overflow, fonts, spacing. This separation prevents AI-generated content from breaking the layout.

5. **ATS score = mostly deterministic. LLM only handles semantic parts.** Text extractability, section detection, date parsing — deterministic code checks on the re-parsed PDF. Only keyword overlap uses the LLM. This makes the score reliable and explainable.

6. **Basic fact grounding in V1.** Flag suggestions that introduce new entities (metrics, percentages, tool names) not present in the original resume or the JD. The user can still accept, but they've been warned. Full factual database is V2.

7. **AIProvider abstraction seam.** One interface, one GeminiProvider in V1. No failover logic built. But when you want to add OpenAI or Ollama later, you swap providers without touching business logic.

8. **Auto-save is debounced.** 1.5s of inactivity → server action. No save button. "Saving… → Saved" indicator via `isDirty`.

9. **Say no to scope.** No image upload, no multi-API auto-switch, no multi-template in V1. Cutting features is a senior signal.

---

## 13. What "Done" Looks Like

You can:
1. Sign in
2. Upload a PDF resume → it parses
3. Paste a JD → see suggestions with reasons
4. Accept 3, reject 1 → see diff
5. Preview updates live
6. Download an ATS-clean PDF
7. See a scorecard that changes as you edit

That loop working end-to-end is V1. Ship that before adding a single template or the cover letter.

---

## 14. The Senior Signal (what makes this stand out)

Four things, specifically:
1. **The ATS scorer's methodology writeup** — a README/blog post explaining what you check, why, and the false-positive/negative tradeoffs. Single biggest lever.
2. **Strict schema-driven LLM output** — a typed pipeline (ResumeDocument → typed Section → Bullet) with discriminated unions, Zod validation, and retry. Shows you've shipped LLM features in prod.
3. **Basic fact grounding** — programmatic hallucination detection that flags invented metrics/tech. Not a full factual database, but a real guardrail that most AI resume tools skip entirely.
4. **Clean product instinct** — saying no to features (no image upload, no multi-API switch, no multi-template in V1) is itself a senior behavior. Junior devs add everything; senior devs cut.
