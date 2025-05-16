import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get('by-date')
  findByDate(@Query('date') date: string) {
    return this.statisticsService.findByDate(date);
  }
}
