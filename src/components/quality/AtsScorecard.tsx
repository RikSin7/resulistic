export function AtsScorecard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ATS scorecard</h2>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span>Overall score</span>
          <span className="font-semibold text-slate-900">91/100</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span>Keyword overlap</span>
          <span className="font-semibold text-emerald-700">Pass</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span>Section parsing</span>
          <span className="font-semibold text-emerald-700">Pass</span>
        </div>
      </div>
    </section>
  );
}
