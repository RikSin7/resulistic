export function JdInput() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Job description</h2>
      <textarea
        defaultValue="We are looking for a senior frontend engineer with React, TypeScript, system design, and product-minded execution experience."
        className="mt-4 min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none focus:border-slate-400"
      />
    </section>
  );
}
