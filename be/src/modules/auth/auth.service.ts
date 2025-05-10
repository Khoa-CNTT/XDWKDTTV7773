import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    // (Cần thêm mã hóa password và xác thực ở đây)
    if (user.so_dien_thoai !== loginDto.password) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    return { message: 'Đăng nhập thành công', user };
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('Email đã tồn tại');
    }

    const user = this.userRepo.create(registerDto);
    await this.userRepo.save(user);

    return { message: 'Đăng ký thành công', user };
  }
}
