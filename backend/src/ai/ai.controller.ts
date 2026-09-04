import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { AskAssistantDto } from './dto/ask-assistant.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private aiService: AiService) {}

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
}