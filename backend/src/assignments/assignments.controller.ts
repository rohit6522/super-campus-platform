import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service.js';
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto.js';
import { GradeSubmissionDto } from './dto/grade-submission.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(
    private assignmentsService: AssignmentsService,
    private studentsService: StudentsService,
  ) {}

  @Post()
  @Roles(UserRole.FACULTY)
  create(@CurrentUser() user: any, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(user.userId, dto);
  }

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.assignmentsService.findBySubject(subjectId);
  }

  // Static routes MUST come before ':id' routes, or Nest matches the dynamic one first
  @Get('my/submissions')
  @Roles(UserRole.STUDENT)
  async getMySubmissions(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.assignmentsService.getMySubmissions(studentId);
  }

  @Post('submissions/:submissionId/grade')
  @Roles(UserRole.FACULTY)
  grade(
    @CurrentUser() user: any,
    @Param('submissionId') submissionId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.assignmentsService.grade(submissionId, user.userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Post(':id/submit')
  @Roles(UserRole.STUDENT)
  async submit(
    @CurrentUser() user: any,
    @Param('id') assignmentId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.assignmentsService.submit(assignmentId, studentId, dto);
  }

  @Get(':id/submissions')
  @Roles(UserRole.FACULTY, UserRole.ADMIN, UserRole.HOD)
  getSubmissions(@Param('id') assignmentId: string) {
    return this.assignmentsService.getSubmissionsForAssignment(assignmentId);
  }
}