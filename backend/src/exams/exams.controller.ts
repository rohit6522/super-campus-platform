import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { EnterResultDto } from './dto/enter-result.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from '../subjects/schemas/subject.schema.js';
import { Result, ResultDocument } from './schemas/result.schema.js';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(
    private examsService: ExamsService,
    private studentsService: StudentsService,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  createExam(@Body() dto: CreateExamDto) {
    return this.examsService.createExam(dto);
  }

  @Get()
  findExams(
    @Query('departmentId') departmentId: string,
    @Query('semester') semester: string,
  ) {
    return this.examsService.findExamsByDepartmentAndSemester(
      departmentId,
      parseInt(semester, 10),
    );
  }

  @Post(':examId/results')
  @Roles(UserRole.FACULTY)
  enterResults(@Param('examId') examId: string, @Body() dto: EnterResultDto) {
    return this.examsService.enterResults(examId, dto);
  }

  @Get('my/results')
  @Roles(UserRole.STUDENT)
  async getMyResults(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.examsService.getStudentAllResults(studentId);
  }

  // Recalculates and stores SGPA for the given semester, then returns updated CGPA
  @Post('my/semester/:semester/finalize')
  @Roles(UserRole.STUDENT)
  async finalizeSemester(
    @CurrentUser() user: any,
    @Param('semester') semester: string,
  ) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    const semesterNum = parseInt(semester, 10);

    // Gather all results for this student where the subject belongs to this semester
    const results = await this.resultModel
      .find({ studentId })
      .populate<{ subjectId: SubjectDocument }>('subjectId')
      .exec();

    const thisSemesterResults = results.filter(
      (r) => (r.subjectId as any).semester === semesterNum,
    );

    if (thisSemesterResults.length === 0) {
      return { message: 'No results found for this semester yet' };
    }

    const subjectResults = thisSemesterResults.map((r) => ({
      subjectId: String((r.subjectId as any)._id),
      credits: (r.subjectId as any).credits,
      gradePoint: r.gradePoint ?? 0,
    }));

    await this.examsService.computeSemesterResult(studentId, semesterNum, subjectResults);
    return this.examsService.computeCGPA(studentId);
  }

  @Get('my/cgpa')
  @Roles(UserRole.STUDENT)
  async getMyCGPA(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.examsService.computeCGPA(studentId);
  }
}