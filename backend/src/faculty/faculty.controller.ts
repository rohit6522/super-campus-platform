import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FacultyService } from './faculty.service.js';
import { CreateFacultyProfileDto } from './dto/create-faculty-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('faculty')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Post('profile')
  @Roles(UserRole.FACULTY, UserRole.HOD)
  createMyProfile(@CurrentUser() user: any, @Body() dto: CreateFacultyProfileDto) {
    return this.facultyService.createProfile(user.userId, dto);
  }
  @Get('me')
  @Roles(UserRole.FACULTY, UserRole.HOD)
  getMyProfile(@CurrentUser() user: any) {
    return this.facultyService.findMyProfile(user.userId);
  }

  @Get('department/:departmentId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  findByDepartment(@Param('departmentId') departmentId: string) {
    return this.facultyService.findAllByDepartment(departmentId);
  }
}