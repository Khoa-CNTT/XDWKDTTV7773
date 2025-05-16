import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  ten_san_pham: string;

  @IsNotEmpty()
  mo_ta: string;

  @IsNumber()
  gia: number;

  @IsNumber()
  id_danh_muc: number;

  @IsString()
  hinh_anh: string;

  @IsOptional()
  @IsString()
  mau_sac?: string;

  @IsOptional()
  @IsString()
  chat_lieu?: string;

  @IsOptional()
  @IsNumber()
  so_luong?: number;

  @IsOptional()
  @IsString()
  size?: string;
}
