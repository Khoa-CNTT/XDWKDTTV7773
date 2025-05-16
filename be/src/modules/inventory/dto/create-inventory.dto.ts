// create-inventory.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { TrangThaiKho } from '../entities/inventory.entity';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  id_san_pham: number;

  @IsNotEmpty()
  @IsString()
  nha_cung_cap: string;

  @IsNotEmpty()
  @IsNumber()
  gia_nhap: number;

  @IsNotEmpty()
  @IsNumber()
  so_luong: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  chat_lieu?: string;

  @IsOptional()
  @IsString()
  mau_sac?: string;

  @IsOptional()
  @IsEnum(TrangThaiKho)
  trang_thai?: TrangThaiKho;
}
