export async function analyzeKeywords(resume: Record<string, unknown>, jd: string) {
  return {
    ok: true,
    matchedKeywords: [],
    missingKeywords: [],
    resume,
    jd,
  };
}
