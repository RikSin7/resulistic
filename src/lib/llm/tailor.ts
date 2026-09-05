export async function tailorResume(resume: Record<string, unknown>, jd: string) {
  return {
    ok: true,
    suggestions: [{ resume, jd, reason: "Tailoring placeholder" }],
  };
}
