export function ResumeEditor() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Resume details</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Editable
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            defaultValue="Alex Morgan"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <input
            defaultValue="Senior Frontend Engineer"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>
    </section>
  );
}
