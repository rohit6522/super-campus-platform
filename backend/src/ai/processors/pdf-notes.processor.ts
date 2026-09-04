import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'bullmq';
import { AiJob, AiJobDocument, AiJobStatus } from '../schemas/ai-job.schema.js';
import { Note, NoteDocument } from '../schemas/note.schema.js';
import { GroqClient } from '../groq.client.js';

export interface PdfNotesJobData {
  jobId: string;
  studentId: string;
  extractedText: string;
  fileName: string;
}

@Injectable()
@Processor('pdf-notes')
export class PdfNotesProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfNotesProcessor.name);

  constructor(
    @InjectModel(AiJob.name) private aiJobModel: Model<AiJobDocument>,
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private groqClient: GroqClient,
  ) {
    super();
  }

  async process(job: Job<PdfNotesJobData>): Promise<void> {
    const { jobId, studentId, extractedText, fileName } = job.data;

    try {
      await this.aiJobModel.findByIdAndUpdate(jobId, { status: AiJobStatus.PROCESSING });

      const prompt = `You are an expert academic note-taker. Given the following study material, produce structured notes.
Respond ONLY in valid JSON, no markdown formatting, no code fences, matching exactly this shape:
{
  "summary": "a concise 2-3 sentence summary",
  "keyConcepts": ["concept 1", "concept 2", ...],
  "importantPoints": ["point 1", "point 2", ...],
  "definitions": [{"term": "term", "definition": "definition"}, ...],
  "examples": ["example 1", ...]
}

STUDY MATERIAL:
${extractedText.slice(0, 8000)}`;
      // Truncated to 8000 chars to stay within a safe context window margin for the free-tier model

      const response = await this.groqClient.chat([
        { role: 'system', content: 'You output only valid JSON, nothing else.' },
        { role: 'user', content: prompt },
      ]);

      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const note = await this.noteModel.create({
        studentId,
        title: fileName.replace(/\.pdf$/i, ''),
        summary: parsed.summary,
        keyConcepts: parsed.keyConcepts,
        importantPoints: parsed.importantPoints,
        definitions: parsed.definitions ?? [],
        examples: parsed.examples ?? [],
      });

      await this.aiJobModel.findByIdAndUpdate(jobId, {
        status: AiJobStatus.COMPLETED,
        resultId: note._id,
      });
    } catch (error) {
      this.logger.error(`PDF notes job ${jobId} failed`, error);
      await this.aiJobModel.findByIdAndUpdate(jobId, {
        status: AiJobStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}