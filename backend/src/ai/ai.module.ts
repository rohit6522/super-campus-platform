import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { AiDocument, AiDocumentSchema } from './schemas/ai-document.schema.js';
import { AiJob, AiJobSchema } from './schemas/ai-job.schema.js';
import { Note, NoteSchema } from './schemas/note.schema.js';
import { GroqClient } from './groq.client.js';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { PdfNotesProcessor } from './processors/pdf-notes.processor.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';
import { QueueModule } from '../queue/queue.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiDocument.name, schema: AiDocumentSchema },
      { name: AiJob.name, schema: AiJobSchema },
      { name: Note.name, schema: NoteSchema },
    ]),
    QueueModule,
    BullModule.registerQueue({ name: 'pdf-notes' }),
    AuthModule,
    StudentsModule,
  ],
  providers: [GroqClient, AiService, PdfNotesProcessor],
  controllers: [AiController],
  exports: [GroqClient, AiService],
})
export class AiModule {}