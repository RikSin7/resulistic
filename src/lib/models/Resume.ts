export type ResumeModelShape = {
  userId: string;
  title: string;
  content: Record<string, unknown>;
  sourceJd?: string | null;
  atsScore?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const ResumeModel = {
  name: "Resume",
  schema: "placeholder",
};
