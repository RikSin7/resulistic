export async function factCheckSuggestion(suggestion: Record<string, unknown>) {
  return {
    ok: true,
    suggestion,
    warnings: [],
  };
}
