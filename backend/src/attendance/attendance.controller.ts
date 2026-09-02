import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private studentsService: StudentsService,
  ) {}

  @Post('sessions')
  @Roles(UserRole.FACULTY)
  createSession(@CurrentUser() user: any, @Body() dto: CreateSessionDto) {
    return this.attendanceService.createSession(user.userId, dto);
  }

  @Post('sessions/:sessionId/mark')
  @Roles(UserRole.FACULTY)
  markAttendance(
    @CurrentUser() user: any,
    @Param('sessionId') sessionId: string,
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.attendanceService.markAttendance(sessionId, user.userId, dto);
  }

  @Get('sessions/:sessionId')
  @Roles(UserRole.FACULTY, UserRole.ADMIN, UserRole.HOD)
  getSessionRoster(@Param('sessionId') sessionId: string) {
    return this.attendanceService.getSessionRoster(sessionId);
  }

  @Get('my/subject/:subjectId')
  @Roles(UserRole.STUDENT)
  async getMyAttendanceForSubject(
    @CurrentUser() user: any,
    @Param('subjectId') subjectId: string,
  ) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.attendanceService.getStudentAttendanceForSubject(studentId, subjectId);
  }

  @Get('my/overall')
  @Roles(UserRole.STUDENT)
  async getMyOverallAttendance(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.attendanceService.getStudentOverallAttendance(studentId);
  }
}