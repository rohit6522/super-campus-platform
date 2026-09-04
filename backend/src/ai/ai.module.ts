import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiDocument, AiDocumentSchema } from './schemas/ai-document.schema.js';
import { GroqClient } from './groq.client.js';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiDocument.name, schema: AiDocumentSchema }]),
    AuthModule,
  ],
  providers: [GroqClient, AiService],
  controllers: [AiController],
  exports: [GroqClient, AiService],
})
export class AiModule {}