import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module'; // 👈 Thêm
import { OtpRequest } from './entities/otp.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpRequest, User]),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'default-secret', signOptions: { expiresIn: '7d' } }),
    PassportModule,
    UsersModule, // 👈 BẮT BUỘC
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
