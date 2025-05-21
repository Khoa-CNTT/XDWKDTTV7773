import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  ma_giam_gia: string;

  @IsString()
  @IsNotEmpty()
  dieu_kien_su_dung: string;

  @IsInt()
  so_luong: number;

  @IsDateString()
  han_su_dung: string;
}
