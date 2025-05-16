// src/modules/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  ho_ten?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  dia_chi?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(['admin', 'nhan_vien', 'khach_hang'])
  vai_tro?: string;

  @IsOptional()
  trang_thai?: boolean;
}
