// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto): Promise<User> {
  const existing = await this.findByEmail(dto.email);
  if (existing) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }

  const user = new User();

  user.ho_ten = dto.ho_ten;
  user.email = dto.email;
  user.vai_tro = dto.vai_tro;
  user.so_dien_thoai = dto.so_dien_thoai;
  user.dia_chi = dto.dia_chi;
  user.trang_thai = dto.trang_thai ?? true; // mặc định true

  if (dto.password) {
    user.password = await bcrypt.hash(dto.password, 10);
  }

  return await this.userRepo.save(user);
}


  async findAll() {
    const users = await this.userRepo.find();
    return users.map(this.mapUserForFE);
  }

  private mapRole(role: string): string {
    if (role === 'admin') return 'Admin';
    if (role === 'nhan_vien') return 'Nhân viên';
    return 'Khách hàng';
  }

  private mapUserForFE = (u: User) => ({
    id: u.id_nguoidung,
    name: u.ho_ten,
    email: u.email,
    phone: u.so_dien_thoai,
    address: u.dia_chi,
    role: this.mapRole(u.vai_tro),
    status: u.trang_thai ? 'Hoạt động' : 'Khóa',
    avatar: u.anh_dai_dien,
  });

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);

    if (file) {
      user.anh_dai_dien = file.filename;
    }

    

    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async toggleStatus(id: number): Promise<User> {
  const user = await this.findOne(id);
  user.trang_thai = !user.trang_thai;
  return await this.userRepo.save(user);
}


  async remove(id: number): Promise<void> {
    await this.userRepo.delete({ id_nguoidung: id });
  }

  async updateAvatar(id: number, file: Express.Multer.File): Promise<User> {
  const user = await this.findOne(id);
  user.anh_dai_dien = file.filename;
  return this.userRepo.save(user);
}

  async changePassword(id: number, oldPass: string, newPass: string): Promise<string> {
  const user = await this.userRepo.findOne({ where: { id_nguoidung: id }, select: ['password'] });

  if (!user) throw new NotFoundException('Không tìm thấy người dùng');

  const isMatch = await bcrypt.compare(oldPass, user.password);
  if (!isMatch) {
    throw new Error('Mật khẩu cũ không chính xác');
  }

  const newHashedPassword = await bcrypt.hash(newPass, 10);
  await this.userRepo.update({ id_nguoidung: id }, { password: newHashedPassword });

  return 'Cập nhật mật khẩu thành công';
}


}
