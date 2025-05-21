import { IsNotEmpty, IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  id_nguoi_dung: number;

  @IsNumber()
  tong_tien: number;

  @IsEnum(OrderStatus)
  trang_thai: OrderStatus;

  @IsString()
  dia_chi_giao: string;

  @IsNotEmpty()
  ngay_dat: Date;

  @IsArray()
  chi_tiet: {
    id_san_pham: number;
    so_luong: number;
    don_gia: number;
    kich_co: string;
  }[];
}
