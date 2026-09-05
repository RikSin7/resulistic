import Link from "next/link";

const resumes = [
  { title: "Senior Frontend Engineer", updatedAt: "2 hours ago", score: 91 },
  { title: "Product Designer - AI", updatedAt: "Yesterday", score: 88 },
  { title: "Full Stack Engineer", updatedAt: "3 days ago", score: 94 },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Your resumes</h1>
        </div>
        <Link
          href="/editor"
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          New resume
        </Link>
      </div>

      <div className="grid gap-4">
        {resumes.map((resume) => (
          <Link
            key={resume.title}
            href="/editor"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{resume.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Updated {resume.updatedAt}</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                ATS {resume.score}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
