export function SuggestionPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">AI suggestions</h2>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">Add measurable impact</span>
            <div className="flex gap-2">
              <button className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white">Accept</button>
              <button className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">Reject</button>
            </div>
          </div>
          <p className="mt-2 text-amber-800">Replace vague claims with impact metrics like “improved performance by 32%”.</p>
        </div>
      </div>
    </section>
  );
}
