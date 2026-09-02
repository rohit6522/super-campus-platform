import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post('profile')
  @Roles(UserRole.STUDENT) // only a student can create their own student profile
  createMyProfile(
    @CurrentUser() user: any,
    @Body() dto: CreateStudentProfileDto,
  ) {
    return this.studentsService.createProfile({
      userId: user.userId,
      ...dto,
    });
  }

  @Get('me')
  @Roles(UserRole.STUDENT)
  getMyProfile(@CurrentUser() user: any) {
    return this.studentsService.findMyProfile(user.userId);
  }
}