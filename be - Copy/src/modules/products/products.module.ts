import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity'; // <-- import entity Inventory

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Inventory]), // <-- thêm Inventory
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // nếu cần dùng ở module khác
})
export class ProductsModule {}
