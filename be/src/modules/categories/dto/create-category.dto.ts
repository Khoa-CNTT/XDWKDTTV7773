// src/modules/categories/dto/create-category.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

// create-category.dto.ts
export class CreateCategoryDto {
  ten_danh_muc: string;
  parent_id?: number;
}

