import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, VaiTro  } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Lọc theo vai trò
  // users.service.ts
async findByRole(role: VaiTro) {
  const users = await this.userRepo.find({ where: { vai_tro: role } });
  return users.map(this.mapUserForFE);
}



  // Khóa/mở tài khoản (trang_thai = true/false)
  async updateStatus(id: number, status: boolean) {
    const user = await this.findOne(id);
    user.trang_thai = status;
    await this.userRepo.save(user);
    return { message: status ? "Đã mở khóa" : "Đã tạm khóa", user: this.mapUserForFE(user) };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto): Promise<User> {
  const existing = await this.findByEmail(dto.email);
  if (existing) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }

  const user = this.userRepo.create({
    ho_ten: dto.ho_ten,
    email: dto.email,
    vai_tro: dto.vai_tro as 'khach_hang' | 'nhan_vien' | 'quan_ly',
    so_dien_thoai: dto.so_dien_thoai,
    dia_chi: dto.dia_chi,
    trang_thai: dto.trang_thai ?? true,
    password: dto.password ? await bcrypt.hash(dto.password, 10) : undefined,
    
  });

  return await this.userRepo.save(user);
}


  // Trả về danh sách cho FE
  async findAll(role?: string): Promise<any[]> {
  let users: User[];
  if (role) {
    users = await this.userRepo.find({ where: { vai_tro: role as any } });
  } else {
    users = await this.userRepo.find();
  }
  return users.map(this.mapUserForFE);
}


  private mapRole(role: string): string {
    if (role === 'quan_ly') return 'Admin';
    if (role === 'nhan_vien') return 'Nhân viên';
    return 'Khách hàng';
  }

  private mapUserForFE = (u: User) => ({
  id: u.id_nguoidung,
  name: u.ho_ten || 'Chưa cập nhật',
  email: u.email || 'Chưa cập nhật',
  phone: u.so_dien_thoai || 'Chưa cập nhật',
  address: u.dia_chi || 'Chưa cập nhật',
  group: this.mapRole(u.vai_tro),
  isLocked: !u.trang_thai,
  avatar: u.anh_dai_dien,
});


  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);
    if (file) user.anh_dai_dien = file.filename;
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

  async changePassword(id: number, oldPass: string, newPass: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: id }, select: ['password'] });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new Error('Mật khẩu cũ không chính xác');
    const newHashedPassword = await bcrypt.hash(newPass, 10);
    await this.userRepo.update({ id_nguoidung: id }, { password: newHashedPassword });
    return 'Cập nhật mật khẩu thành công';
  }
}
