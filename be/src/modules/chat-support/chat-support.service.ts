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

  findByUser(id_nguoi_dung: number) {
    return this.chatRepo.find({ where: { user: { id_nguoidung: id_nguoi_dung } }, relations: ['user'] });
  }
}
