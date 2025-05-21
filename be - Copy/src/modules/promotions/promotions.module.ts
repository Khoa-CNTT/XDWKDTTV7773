import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/promotion.entity';
import { DiscountsController } from './promotions.controller';
import { DiscountsService } from './promotions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class PromotionsModule {}
