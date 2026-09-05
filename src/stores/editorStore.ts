export type EditorStoreState = {
  resume: Record<string, unknown> | null;
  suggestions: Array<Record<string, unknown>>;
  atsScore: Record<string, unknown> | null;
  isDirty: boolean;
};

export const editorStoreState: EditorStoreState = {
  resume: null,
  suggestions: [],
  atsScore: null,
  isDirty: false,
};

export function setResume(resume: Record<string, unknown>) {
  editorStoreState.resume = resume;
  editorStoreState.isDirty = true;
}

export function setSuggestions(suggestions: Array<Record<string, unknown>>) {
  editorStoreState.suggestions = suggestions;
}

export function setAtsScore(score: Record<string, unknown>) {
  editorStoreState.atsScore = score;
}
