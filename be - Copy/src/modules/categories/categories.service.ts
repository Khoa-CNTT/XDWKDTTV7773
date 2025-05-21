import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IsNull } from 'typeorm';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    let parent: Category | null = null;
    if (dto.parent_id) {
      parent = await this.categoryRepo.findOne({ where: { id: dto.parent_id } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }
    const cat = this.categoryRepo.create({
      ten_danh_muc: dto.ten_danh_muc,
      parent: parent || undefined, // Truyền undefined nếu không có parent
    });
    return this.categoryRepo.save(cat);
  }
  async findAll(): Promise<Category[]> {
    // Trả về cả cha lẫn con
    return this.categoryRepo.find({ relations: ['parent', 'children'] });
  }

  async findRootCategories(): Promise<Category[]> {
    // Chỉ lấy danh mục gốc (parent_id NULL)
    return this.categoryRepo.find({ where: { parent: IsNull() } });
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.categoryRepo.findOne({
      where: { id: id },
      relations: ['parent', 'children'],
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findOne(id);
    if (dto.ten_danh_muc !== undefined) cat.ten_danh_muc = dto.ten_danh_muc;
    if (dto.parent_id !== undefined) {
      cat.parent = dto.parent_id ? await this.categoryRepo.findOne({ where: { id: dto.parent_id } }) : undefined;
    }
    return this.categoryRepo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.categoryRepo.remove(cat);
  }
}
