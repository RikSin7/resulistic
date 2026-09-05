export function ResumePreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Live preview</h2>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          Ready
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="text-xl font-bold text-slate-900">Alex Morgan</p>
        <p className="mt-1 text-slate-600">Senior Frontend Engineer</p>
        <div className="mt-5 space-y-2">
          <p className="font-semibold text-slate-900">Experience</p>
          <p>• Led frontend architecture for a B2B SaaS platform.</p>
          <p>• Improved conversion metrics through measurable UX changes.</p>
        </div>
      </div>
    </section>
  );
}
