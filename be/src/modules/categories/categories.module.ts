import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DanhMuc } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DanhMuc])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}