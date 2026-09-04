import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ _id: false })
class QuestionAnswer {
  @Prop({ required: true }) questionIndex: number;
  @Prop({ required: true }) selectedIndex: number;
  @Prop({ required: true }) isCorrect: boolean;
}

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'McqSet', required: true })
  mcqSetId: Types.ObjectId;

  @Prop({ type: [QuestionAnswer], required: true })
  answers: QuestionAnswer[];

  @Prop({ required: true })
  score: number; // number correct

  @Prop({ required: true })
  totalQuestions: number;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.index({ studentId: 1, mcqSetId: 1 }); 