import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiDocument, AiDocumentDocument } from './schemas/ai-document.schema.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { chunkText } from './utils/chunker.util.js';
import { GroqClient } from './groq.client.js';

@Injectable()
export class AiService {
  constructor(
    @InjectModel(AiDocument.name) private aiDocumentModel: Model<AiDocumentDocument>,
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

  // Retrieves the most relevant chunks across all documents using MongoDB's text search.
  // This is the retrieval step — will be swapped for real vector search later.
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
      // No matching context found — be honest rather than letting the LLM hallucinate an answer
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
}