import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

export class CreatePaymentDto {
  @IsNumber()
  id_don_hang: number;

  @IsEnum(PaymentMethod)
  phuong_thuc: PaymentMethod;

  @IsEnum(PaymentStatus)
  trang_thai: PaymentStatus;

  @IsNotEmpty()
  thoi_gian_tao: Date;

  @IsNotEmpty()
  thoi_gian_thanh_toan: Date;

  @IsString()
  ma_giao_dich: string;

  @IsNumber()
  tong_tien: number;

  @IsOptional()
  @IsString()
  ghi_chu?: string;
}
