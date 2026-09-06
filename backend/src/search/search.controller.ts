import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}