import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { DanhMuc } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, DanhMuc])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}