import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpRequest } from './entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(OtpRequest)
    private otpRepo: Repository<OtpRequest>,

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
      select: ['id_nguoidung', 'email', 'ho_ten', 'vai_tro', 'password', 'trang_thai'],
    });

    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    if (!user.trang_thai) {
      throw new UnauthorizedException('Tài khoản đã bị khóa, vui lòng liên hệ Admin');
    }

    if (loginDto.role && user.vai_tro !== loginDto.role) {
      throw new UnauthorizedException('Tài khoản không có quyền truy cập.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    const payload = {
      sub: user.id_nguoidung,
      vai_tro: user.vai_tro,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: user.id_nguoidung,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
      },
      access_token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, ho_ten, password } = registerDto;
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email đã tồn tại');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepo.save({
      email,
      otp,
      ho_ten: ho_ten || 'Người dùng mới',
      password,
      so_dien_thoai: '0123456789',
      dia_chi: 'Chưa cập nhật',
      expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác minh tài khoản - DELIASHOP',
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã này sẽ hết hạn sau 5 phút.</p>`,
    });

    return { message: 'Đã gửi mã OTP xác minh về email của bạn.' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.otpRepo.findOne({
      where: { email: dto.email, otp: dto.otp },
    });
    if (!record) throw new BadRequestException('Không tìm thấy yêu cầu xác thực.');

    if (record.expires_at.getTime() < Date.now()) {
      await this.otpRepo.delete({ email: dto.email });
      throw new UnauthorizedException('Mã OTP đã hết hạn.');
    }

    const hashed = await bcrypt.hash(record.password, 10);
    const user = this.userRepo.create({
      ho_ten: record.ho_ten,
      email: record.email,
      password: hashed,
      so_dien_thoai: record.so_dien_thoai ?? '0123456789',
      dia_chi: record.dia_chi ?? 'Chưa cập nhật',
      vai_tro: 'khach_hang',
      trang_thai: true,
    });

    await this.userRepo.save(user);
    await this.otpRepo.delete({ email: dto.email });

    return { message: 'Xác minh thành công, tài khoản đã được tạo.' };
  }
}
