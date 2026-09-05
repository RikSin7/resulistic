export async function parseResumeText(rawText: string) {
  return {
    ok: true,
    resume: { title: "Parsed resume", rawText },
  };
}
