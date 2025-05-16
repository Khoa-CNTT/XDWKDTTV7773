import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DanhMuc } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(DanhMuc)
    private categoryRepo: Repository<DanhMuc>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOne({
  where: { id_danh_muc: dto.id_danh_muc },
});

const product = this.productRepo.create({
  ...dto,
  category: category ?? undefined, // tránh null
});
 return this.productRepo.save(product); // ✅ TRẢ VỀ GIÁ TRỊ
  }

  findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category'] });
  }

  async remove(id: number) {
    return this.productRepo.delete(id);
  }
}