import mongoose, { Schema, models } from 'mongoose';
import type { ResumeDocument, Scorecard } from '@/lib/types';

// The Mongoose document shape (the envelope)
export interface ResumeRecord {
  userId: string;
  title: string;
  content: ResumeDocument;
  sourceJd?: string | null;
  atsScore?: Scorecard | null; 
  createdAt?: Date;
  updatedAt?: Date;
}

const resumeSchema = new Schema<ResumeRecord>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    content: { type: Schema.Types.Mixed, required: true },
    sourceJd: { type: String, default: null },
    atsScore: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const ResumeModel = models.Resume || mongoose.model<ResumeRecord>('Resume', resumeSchema);

export default ResumeModel;
