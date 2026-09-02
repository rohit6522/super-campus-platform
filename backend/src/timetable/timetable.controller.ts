import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service.js';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private timetableService: TimetableService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  create(@Body() dto: CreateTimetableEntryDto) {
    return this.timetableService.create(dto);
  }

  @Get()
  findByDepartmentAndSemester(
    @Query('departmentId') departmentId: string,
    @Query('semester') semester: string,
  ) {
    return this.timetableService.findByDepartmentAndSemester(
      departmentId,
      parseInt(semester, 10),
    );
  }

  @Get('my-timetable')
  @Roles(UserRole.FACULTY)
  findMyTimetable(@CurrentUser() user: any) {
    return this.timetableService.findByFaculty(user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}