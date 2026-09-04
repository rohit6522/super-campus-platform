import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getOverviewStats() {
    return this.adminService.getOverviewStats();
  }

  @Get('department/:departmentId/stats')
  @Roles(UserRole.HOD, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getDepartmentStats(@Param('departmentId') departmentId: string) {
    return this.adminService.getDepartmentStats(departmentId);
  }
}