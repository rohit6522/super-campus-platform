import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '../users/schemas/user.schema.js';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.HOD)
  create(@CurrentUser() user: any, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(user.userId, dto);
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.announcementsService.findAll(limit ? parseInt(limit, 10) : undefined);
  }
}