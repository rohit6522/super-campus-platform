import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AtsService } from './ats.service.js';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('ats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class AtsController {
  constructor(
    private atsService: AtsService,
    private studentsService: StudentsService,
  ) {}

  @Post('analyze')
  async analyze(@CurrentUser() user: any, @Body() dto: AnalyzeResumeDto) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.atsService.analyze(studentId, dto);
  }

  @Get('history')
  async getHistory(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.atsService.getHistory(studentId);
  }

  @Get(':id')
  async getOne(@CurrentUser() user: any, @Param('id') id: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.atsService.getOne(id, studentId);
  }
}