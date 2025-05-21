import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  ten_danh_muc: string;

  @IsOptional()
  @Transform(({ value }) => value === null || value === undefined || value === '' ? undefined : Number(value))
  @IsNumber()
  parent_id?: number;
}
