import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'bullmq';
import { AiJob, AiJobDocument, AiJobStatus } from '../schemas/ai-job.schema.js';
import { McqSet, McqSetDocument } from '../schemas/mcq-set.schema.js';
import { GroqClient } from '../groq.client.js';

export interface PdfMcqsJobData {
  jobId: string;
  studentId: string;
  extractedText: string;
  fileName: string;
}

@Injectable()
@Processor('pdf-mcqs')
export class PdfMcqsProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfMcqsProcessor.name);

  constructor(
    @InjectModel(AiJob.name) private aiJobModel: Model<AiJobDocument>,
    @InjectModel(McqSet.name) private mcqSetModel: Model<McqSetDocument>,
    private groqClient: GroqClient,
  ) {
    super();
  }

  async process(job: Job<PdfMcqsJobData>): Promise<void> {
    const { jobId, studentId, extractedText, fileName } = job.data;

    try {
      await this.aiJobModel.findByIdAndUpdate(jobId, { status: AiJobStatus.PROCESSING });

      const prompt = `You are an expert exam question setter. Given the following study material, generate exactly 5 multiple-choice questions to test understanding.
Respond ONLY in valid JSON, no markdown formatting, no code fences, matching exactly this shape:
{
  "questions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswerIndex": 0,
      "explanation": "why this answer is correct",
      "difficulty": "EASY",
      "topic": "relevant topic name"
    }
  ]
}
correctAnswerIndex must be 0, 1, 2, or 3, matching the index of the correct option in the options array.
difficulty must be exactly one of: EASY, MEDIUM, HARD.

STUDY MATERIAL:
${extractedText.slice(0, 8000)}`;

      const response = await this.groqClient.chat([
        { role: 'system', content: 'You output only valid JSON, nothing else.' },
        { role: 'user', content: prompt },
      ]);

      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Basic sanity validation before saving — catch malformed LLM output early
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('AI response did not contain a valid questions array');
      }
      for (const q of parsed.questions) {
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error('One or more questions did not have exactly 4 options');
        }
        if (typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
          throw new Error('Invalid correctAnswerIndex in generated question');
        }
      }

      const mcqSet = await this.mcqSetModel.create({
        studentId,
        title: fileName.replace(/\.pdf$/i, ''),
        questions: parsed.questions,
      });

      await this.aiJobModel.findByIdAndUpdate(jobId, {
        status: AiJobStatus.COMPLETED,
        resultId: mcqSet._id,
      });
    } catch (error) {
      this.logger.error(`PDF MCQs job ${jobId} failed`, error);
      await this.aiJobModel.findByIdAndUpdate(jobId, {
        status: AiJobStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}