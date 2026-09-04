import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CodingProblemDocument = CodingProblem & Document;

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum Topic {
  ARRAYS = 'ARRAYS',
  STRINGS = 'STRINGS',
  LINKED_LISTS = 'LINKED_LISTS',
  STACK = 'STACK',
  QUEUE = 'QUEUE',
  TREES = 'TREES',
  GRAPHS = 'GRAPHS',
  DYNAMIC_PROGRAMMING = 'DYNAMIC_PROGRAMMING',
  SORTING = 'SORTING',
  SEARCHING = 'SEARCHING',
  RECURSION = 'RECURSION',
  GREEDY = 'GREEDY',
}

@Schema({ _id: false })
class TestCase {
  @Prop({ required: true }) input: string;
  @Prop({ required: true }) expectedOutput: string;
  @Prop({ type: Boolean, default: false }) isHidden: boolean; // hidden test cases aren't shown to students
}

@Schema({ timestamps: true })
export class CodingProblem {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Difficulty })
  difficulty: Difficulty;

  @Prop({ type: [String], enum: Topic, required: true })
  topics: Topic[];

  @Prop({ type: [TestCase], required: true })
  testCases: TestCase[];

  @Prop({ type: String, default: null })
  starterCode?: string | null;

  @Prop({ required: true, min: 1 })
  points: number;
}

export const CodingProblemSchema = SchemaFactory.createForClass(CodingProblem);

CodingProblemSchema.index({ difficulty: 1, topics: 1 });