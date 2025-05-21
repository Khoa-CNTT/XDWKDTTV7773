import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatSupportService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {}

  findAll() {
    return this.chatRepo.find({ relations: ['user'] });
  }

  findByUser(id_nguoidung: number) {
    return this.chatRepo.find({
      where: { id_nguoidung },
      relations: ['user'],
      order: { thoi_gian: 'ASC' },
    });
  }

  async addMessage(data: {
    id_nguoidung: number;
    noi_dung: string;
    nguoi_gui: 'khach' | 'bot' | 'nhan_vien';
    trang_thai?: 'dang_cho' | 'da_tra_loi';
  }) {
    const msg = this.chatRepo.create({
      ...data,
      trang_thai: data.trang_thai ?? (data.nguoi_gui === 'nhan_vien' ? 'da_tra_loi' : 'dang_cho'),
      thoi_gian: new Date(),
    });
    return this.chatRepo.save(msg);
  }

  async markDone(id_nguoidung: number) {
    return this.chatRepo.update(
      { id_nguoidung },
      { trang_thai: 'da_tra_loi' },
    );
  }
}
