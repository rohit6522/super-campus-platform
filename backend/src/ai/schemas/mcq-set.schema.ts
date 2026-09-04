import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type McqSetDocument = McqSet & Document;

@Schema({ _id: false })
class McqQuestion {
  @Prop({ required: true }) question: string;
  @Prop({ type: [String], required: true }) options: string[]; // exactly 4 options
  @Prop({ required: true }) correctAnswerIndex: number; // 0-3
  @Prop({ required: true }) explanation: string;
  @Prop({ required: true }) difficulty: string; // "EASY" | "MEDIUM" | "HARD"
  @Prop({ type: String, default: null }) topic?: string | null;
}

@Schema({ timestamps: true })
export class McqSet {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: [McqQuestion], required: true })
  questions: McqQuestion[];
}

export const McqSetSchema = SchemaFactory.createForClass(McqSet);

McqSetSchema.index({ studentId: 1, createdAt: -1 });