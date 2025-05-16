import { IsNotEmpty, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { DiscountType } from 'src/common/enums/discount-type.enum';

export class CreatePromotionDto {
  @IsNotEmpty()
  ten_khuyen_mai: string;

  @IsNotEmpty()
  ma_giam_gia: string;

  @IsNumber()
  gia_tri: number;

  @IsEnum(DiscountType)
  loai: DiscountType;

  @IsDateString()
  ngay_bat_dau: Date;

  @IsDateString()
  ngay_ket_thuc: Date;
}