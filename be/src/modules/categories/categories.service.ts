// src/modules/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DanhMuc } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(DanhMuc)
    private categoryRepo: Repository<DanhMuc>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<DanhMuc> {
    const parent = dto.parent_id ? await this.categoryRepo.findOne({
  where: { id_danh_muc: dto.parent_id }
}) : null;

const category = this.categoryRepo.create({
  ten_danh_muc: dto.ten_danh_muc,
  parent: parent ?? undefined, // Không dùng null
});

    return this.categoryRepo.save(category);
  }

  findAll(): Promise<DanhMuc[]> {
    return this.categoryRepo.find({ relations: ['parent'] });
  }

  remove(id: number) {
    return this.categoryRepo.delete(id);
  }
}
