import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  ten_san_pham: string;

  @IsNotEmpty()
  @IsString()
  mo_ta: string;

  @IsNotEmpty()
  @IsNumber()
  gia: number;

  @IsNotEmpty()
  @IsString()
  hinh_anh: string;

  @IsOptional()
  @IsString()
  mau_sac?: string;

  @IsOptional()
  @IsString()
  chat_lieu?: string;

  @IsNotEmpty()
  @IsNumber()
  so_luong: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNotEmpty()
  @IsNumber()
  id_danh_muc: number;

  @IsNotEmpty()
  @IsNumber()
  id_kho: number; // Bắt buộc chọn lô kho đã nhập
}
