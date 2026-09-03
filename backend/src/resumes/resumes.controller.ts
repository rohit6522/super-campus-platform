import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ResumesService } from './resumes.service.js';
import { SaveResumeDto } from './dto/save-resume.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT) // entire controller is student-only
export class ResumesController {
  constructor(
    private resumesService: ResumesService,
    private studentsService: StudentsService,
  ) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: SaveResumeDto) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.create(studentId, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.findAllForStudent(studentId);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.findOne(id, studentId);
  }

  @Patch(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: SaveResumeDto) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.update(id, studentId, dto);
  }

  @Post(':id/duplicate')
  async duplicate(@CurrentUser() user: any, @Param('id') id: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.duplicate(id, studentId);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.resumesService.remove(id, studentId);
  }
}