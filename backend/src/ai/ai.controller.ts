import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { AskAssistantDto } from './dto/ask-assistant.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(
    private aiService: AiService,
    private studentsService: StudentsService,
  ) {}

  @Post('documents')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  addDocument(@CurrentUser() user: any, @Body() dto: CreateDocumentDto) {
    return this.aiService.addDocument(user.userId, dto);
  }

  @Get('documents')
  listDocuments() {
    return this.aiService.listDocuments();
  }

  @Post('assistant/ask')
  askAssistant(@Body() dto: AskAssistantDto) {
    return this.aiService.askAssistant(dto.question);
  }

  @Post('pdf/notes')
  @Roles(UserRole.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdfForNotes(
    @CurrentUser() user: any,
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.aiService.uploadPdfForNotes(studentId, file.buffer, file.originalname);
  }

  @Get('jobs/:jobId')
  @Roles(UserRole.STUDENT)
  async getJobStatus(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.aiService.getJobStatus(jobId, studentId);
  }

  @Get('notes')
  @Roles(UserRole.STUDENT)
  async getMyNotes(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.aiService.getMyNotes(studentId);
  }

  @Get('notes/:id')
  @Roles(UserRole.STUDENT)
  async getNote(@CurrentUser() user: any, @Param('id') id: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.aiService.getNote(id, studentId);
  }
}