import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { AiDocument, AiDocumentDocument } from './schemas/ai-document.schema.js';
import { AiJob, AiJobDocument, AiJobStatus, AiJobType } from './schemas/ai-job.schema.js';
import { Note, NoteDocument } from './schemas/note.schema.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { chunkText } from './utils/chunker.util.js';
import { GroqClient } from './groq.client.js';
import type { PdfNotesJobData } from './processors/pdf-notes.processor.js';
import { McqSet, McqSetDocument } from './schemas/mcq-set.schema.js';
import { QuizAttempt, QuizAttemptDocument } from './schemas/quiz-attempt.schema.js';
import type { PdfMcqsJobData } from './processors/pdf-mcqs.processor.js';

@Injectable()
export class AiService {
   constructor(
    @InjectModel(AiDocument.name) private aiDocumentModel: Model<AiDocumentDocument>,
    @InjectModel(AiJob.name) private aiJobModel: Model<AiJobDocument>,
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(McqSet.name) private mcqSetModel: Model<McqSetDocument>,
    @InjectModel(QuizAttempt.name) private quizAttemptModel: Model<QuizAttemptDocument>,
    @InjectQueue('pdf-notes') private pdfNotesQueue: Queue<PdfNotesJobData>,
    @InjectQueue('pdf-mcqs') private pdfMcqsQueue: Queue<PdfMcqsJobData>,
    private groqClient: GroqClient,
  ) {}

  async addDocument(uploadedBy: string, dto: CreateDocumentDto): Promise<AiDocumentDocument> {
    const chunks = chunkText(dto.content).map((text, index) => ({ text, chunkIndex: index }));

    const document = new this.aiDocumentModel({
      title: dto.title,
      sourceType: dto.sourceType,
      chunks,
      uploadedBy,
    });

    return document.save();
  }

  async listDocuments() {
    return this.aiDocumentModel.find().select('-chunks').sort({ createdAt: -1 }).exec();
  }

  private async retrieveRelevantChunks(question: string, limit = 5): Promise<string[]> {
    const results = await this.aiDocumentModel
      .aggregate([
        { $match: { $text: { $search: question } } },
        { $addFields: { score: { $meta: 'textScore' } } },
        { $sort: { score: -1 } },
        { $limit: limit },
        { $unwind: '$chunks' },
        { $project: { chunk: '$chunks.text' } },
      ])
      .exec();

    return results.map((r) => r.chunk);
  }

  async askAssistant(question: string): Promise<{ answer: string; sourcesUsed: number }> {
    const relevantChunks = await this.retrieveRelevantChunks(question);

    if (relevantChunks.length === 0) {
      const answer = await this.groqClient.chat([
        {
          role: 'system',
          content:
            'You are a university assistant. No relevant internal documents were found for this question. ' +
            'Politely tell the student you don\'t have specific information on this topic in the knowledge base, ' +
            'and suggest they contact the relevant department directly.',
        },
        { role: 'user', content: question },
      ]);
      return { answer, sourcesUsed: 0 };
    }

    const context = relevantChunks.join('\n\n---\n\n');

    const answer = await this.groqClient.chat([
      {
        role: 'system',
        content:
          'You are a university assistant. Answer the student\'s question using ONLY the provided context below. ' +
          'If the context does not fully answer the question, say so honestly rather than making things up.\n\n' +
          `CONTEXT:\n${context}`,
      },
      { role: 'user', content: question },
    ]);

    return { answer, sourcesUsed: relevantChunks.length };
  }

  async uploadPdfForNotes(
    studentId: string,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<AiJobDocument> {
    const parsed = await pdfParse(fileBuffer);
    const extractedText = parsed.text;

    if (!extractedText || extractedText.trim().length < 50) {
      throw new NotFoundException('Could not extract meaningful text from this PDF');
    }

    const job = await this.aiJobModel.create({
      studentId,
      type: AiJobType.PDF_TO_NOTES,
      status: AiJobStatus.PENDING,
      sourceFileName: fileName,
    });

    await this.pdfNotesQueue.add('generate-notes', {
      jobId: String(job._id),
      studentId,
      extractedText,
      fileName,
    });

    return job;
  }

  async getJobStatus(jobId: string, studentId: string): Promise<AiJobDocument> {
    const job = await this.aiJobModel.findOne({ _id: jobId, studentId }).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async getMyNotes(studentId: string) {
    return this.noteModel.find({ studentId }).sort({ createdAt: -1 }).exec();
  }

  async getNote(id: string, studentId: string): Promise<NoteDocument> {
    const note = await this.noteModel.findOne({ _id: id, studentId }).exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

    async uploadPdfForMcqs(
    studentId: string,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<AiJobDocument> {
    const parsed = await pdfParse(fileBuffer);
    const extractedText = parsed.text;

    if (!extractedText || extractedText.trim().length < 50) {
      throw new NotFoundException('Could not extract meaningful text from this PDF');
    }

    const job = await this.aiJobModel.create({
      studentId,
      type: AiJobType.PDF_TO_MCQS,
      status: AiJobStatus.PENDING,
      sourceFileName: fileName,
    });

    await this.pdfMcqsQueue.add('generate-mcqs', {
      jobId: String(job._id),
      studentId,
      extractedText,
      fileName,
    });

    return job;
  }

  async getMyMcqSets(studentId: string) {
    return this.mcqSetModel.find({ studentId }).select('-questions.correctAnswerIndex -questions.explanation').sort({ createdAt: -1 }).exec();
  }

  async getMcqSetForQuiz(id: string, studentId: string) {
    const mcqSet = await this.mcqSetModel.findOne({ _id: id, studentId }).exec();
    if (!mcqSet) throw new NotFoundException('MCQ set not found');

    const plain = mcqSet.toObject();

    const sanitizedQuestions = plain.questions.map((q: any) => ({
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic,
      // correctAnswerIndex and explanation deliberately omitted
    }));

    return {
      _id: plain._id,
      studentId: plain.studentId,
      title: plain.title,
      questions: sanitizedQuestions,
    };
  }

  async submitQuizAttempt(
    studentId: string,
    mcqSetId: string,
    selectedAnswers: number[],
  ): Promise<QuizAttemptDocument> {
    const mcqSet = await this.mcqSetModel.findOne({ _id: mcqSetId, studentId }).exec();
    if (!mcqSet) throw new NotFoundException('MCQ set not found');

    if (selectedAnswers.length !== mcqSet.questions.length) {
      throw new NotFoundException('Number of answers does not match number of questions');
    }

    const answers = mcqSet.questions.map((question, index) => {
      const selectedIndex = selectedAnswers[index];
      const isCorrect = selectedIndex === question.correctAnswerIndex;
      return { questionIndex: index, selectedIndex, isCorrect };
    });

    const score = answers.filter((a) => a.isCorrect).length;

    const attempt = new this.quizAttemptModel({
      studentId,
      mcqSetId,
      answers,
      score,
      totalQuestions: mcqSet.questions.length,
    });

    return attempt.save();
  }

  async getQuizResult(attemptId: string, studentId: string) {
    const attempt = await this.quizAttemptModel.findOne({ _id: attemptId, studentId }).exec();
    if (!attempt) throw new NotFoundException('Attempt not found');

    const mcqSet = await this.mcqSetModel.findById(attempt.mcqSetId).exec();

    // Now include correct answers + explanations since the quiz is already submitted
    return {
      attempt,
      questions: mcqSet?.questions ?? [],
    };
  }
}