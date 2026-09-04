import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CodingService } from './coding.service.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { SubmitCodeDto } from './dto/submit-code.dto.js';
import { Difficulty, Topic } from './schemas/coding-problem.schema.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('coding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CodingController {
  constructor(
    private codingService: CodingService,
    private studentsService: StudentsService,
  ) {}

  @Post('problems')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FACULTY)
  createProblem(@Body() dto: CreateProblemDto) {
    return this.codingService.createProblem(dto);
  }

  @Get('problems')
  findProblems(
    @Query('difficulty') difficulty?: Difficulty,
    @Query('topic') topic?: Topic,
    @Query('search') search?: string,
  ) {
    return this.codingService.findProblems({ difficulty, topic, search });
  }

  @Get('my/submissions')
  @Roles(UserRole.STUDENT)
  async getMySubmissions(@CurrentUser() user: any, @Query('problemId') problemId?: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.codingService.getMySubmissions(studentId, problemId);
  }

  @Get('my/progress')
  @Roles(UserRole.STUDENT)
  async getMyProgress(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.codingService.getMyProgress(studentId);
  }

  @Get('problems/:id')
  findProblem(@Param('id') id: string) {
    return this.codingService.findProblem(id, false);
  }

  @Post('submissions')
  @Roles(UserRole.STUDENT)
  async submit(@CurrentUser() user: any, @Body() dto: SubmitCodeDto) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.codingService.submit(studentId, dto);
  }
}