import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { JdInput } from "@/components/ai/JdInput";
import { SuggestionPanel } from "@/components/ai/SuggestionPanel";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { AtsScorecard } from "@/components/quality/AtsScorecard";

export default function EditorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Editor</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Resume Studio</h1>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <ResumeEditor />
          <JdInput />
          <SuggestionPanel />
        </div>

        <div className="space-y-6">
          <ResumePreview />
          <AtsScorecard />
        </div>
      </div>
    </main>
  );
}
