import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PlacementsService } from './placements.service.js';
import { CreateDriveDto } from './dto/create-drive.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';
import { StudentsService } from '../students/students.service.js';

@Controller('placements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacementsController {
  constructor(
    private placementsService: PlacementsService,
    private studentsService: StudentsService,
  ) {}

  @Post('drives')
  @Roles(UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  createDrive(@Body() dto: CreateDriveDto) {
    return this.placementsService.createDrive(dto);
  }

  @Get('drives')
  findAllDrives() {
    return this.placementsService.findAllDrives();
  }

  @Get('stats')
  @Roles(UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getStats() {
    return this.placementsService.getPlacementStats();
  }

  @Get('my/applications')
  @Roles(UserRole.STUDENT)
  async getMyApplications(@CurrentUser() user: any) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.placementsService.getMyApplications(studentId);
  }

  @Get('drives/:driveId')
  findDrive(@Param('driveId') driveId: string) {
    return this.placementsService.findDrive(driveId);
  }

  @Get('drives/:driveId/eligibility')
  @Roles(UserRole.STUDENT)
  async checkEligibility(@CurrentUser() user: any, @Param('driveId') driveId: string) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.placementsService.checkStudentEligibility(driveId, studentId);
  }

  @Post('drives/:driveId/apply')
  @Roles(UserRole.STUDENT)
  async apply(@CurrentUser() user: any, @Param('driveId') driveId: string, @Body() body: { resumeUrl?: string }) {
    const studentId = await this.studentsService.findStudentIdByUserId(user.userId);
    return this.placementsService.apply(driveId, studentId, body.resumeUrl);
  }

  @Get('drives/:driveId/applications')
  @Roles(UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getApplicationsForDrive(@Param('driveId') driveId: string) {
    return this.placementsService.getApplicationsForDrive(driveId);
  }

  @Patch('applications/:applicationId/status')
  @Roles(UserRole.PLACEMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.placementsService.updateApplicationStatus(applicationId, dto.status);
  }
}