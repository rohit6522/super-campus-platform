import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiDocumentDocument = AiDocument & Document;

@Schema({ _id: false })
class DocumentChunk {
  @Prop({ required: true }) text: string;
  @Prop({ required: true }) chunkIndex: number;
}

@Schema({ timestamps: true })
export class AiDocument {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  sourceType: string; // e.g. "policy", "faq", "announcement" — free-form category

  @Prop({ type: [DocumentChunk], default: [] })
  chunks: DocumentChunk[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;
}

export const AiDocumentSchema = SchemaFactory.createForClass(AiDocument);

// Text index across chunk content — powers our keyword-based retrieval
AiDocumentSchema.index({ 'chunks.text': 'text', title: 'text' });