// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'nhan_vien', 'khach_hang'])
  role?: string;
}


