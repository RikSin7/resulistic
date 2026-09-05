export type LlmResponse<T> = {
  data: T;
};

export interface AIProvider {
  parseResume(rawText: string): Promise<LlmResponse<Record<string, unknown>>>;
  tailorResume(resume: Record<string, unknown>, jd: string): Promise<LlmResponse<Record<string, unknown>[]>>;
  analyzeKeywords(resume: Record<string, unknown>, jd: string): Promise<LlmResponse<Record<string, unknown>>>;
}
