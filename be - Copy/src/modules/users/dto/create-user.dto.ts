// src/modules/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  ho_ten: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  dia_chi?: string;

  @IsNotEmpty()
  @IsEnum(['khach_hang', 'nhan_vien', 'admin'])
  vai_tro: string;

  @IsOptional()
  trang_thai?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
