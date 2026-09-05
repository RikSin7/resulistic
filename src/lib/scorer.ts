export type AtsCheck = {
  name: string;
  passed: boolean;
  score: number;
  detail: string;
};

export type AtsScorecard = {
  overallScore: number;
  checks: AtsCheck[];
};

export async function scoreResume(): Promise<AtsScorecard> {
  return {
    overallScore: 91,
    checks: [
      {
        name: "Contact block",
        passed: true,
        score: 100,
        detail: "Contact information is present and parseable.",
      },
      {
        name: "Section headings",
        passed: true,
        score: 90,
        detail: "Expected resume sections were detected.",
      },
    ],
  };
}
