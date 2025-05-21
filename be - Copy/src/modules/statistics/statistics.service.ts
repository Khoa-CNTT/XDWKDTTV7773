import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepo: Repository<Statistic>
  ) {}

  findAll() {
    return this.statisticRepo.find({ relations: ['category'] });
  }

  findByDate(date: string) {
    const parsedDate = new Date(date);
    return this.statisticRepo.find({
      where: { ngay_thong_ke: parsedDate },
      relations: ['category'],
    });
  }

  findByRange(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.statisticRepo.find({
      where: {
        ngay_thong_ke: Between(fromDate, toDate),
      },
      relations: ['category'],
    });
  }
}
