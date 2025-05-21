import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Statistic } from './entities/statistic.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic, Category])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}