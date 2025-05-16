import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  id_nguoi_dung: number;

  @IsNumber()
  id_san_pham: number;

  @IsNumber()
  so_luong: number;

  @IsString()
  kich_co: string;
}
