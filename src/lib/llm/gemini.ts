import type { AIProvider } from "@/lib/llm/provider";

export class GeminiProvider implements AIProvider {
  async parseResume(rawText: string) {
    return {
      data: {
        rawText,
      },
    };
  }

  async tailorResume(resume: Record<string, unknown>, jd: string) {
    return {
      data: [{ resume, jd }],
    };
  }

  async analyzeKeywords(resume: Record<string, unknown>, jd: string) {
    return {
      data: { resume, jd, matchedKeywords: [] },
    };
  }
}
