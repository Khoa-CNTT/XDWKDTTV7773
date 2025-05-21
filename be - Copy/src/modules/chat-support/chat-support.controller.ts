import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { ChatSupportService } from './chat-support.service';

@Controller('chat-support')
export class ChatSupportController {
  constructor(private readonly chatSupportService: ChatSupportService) {}

  @Get()
  findAll() {
    return this.chatSupportService.findAll();
  }

  @Get('by-user')
  findByUser(@Query('id_nguoidung') id: number) {
    return this.chatSupportService.findByUser(Number(id));
  }

  @Post()
  async addMessage(@Body() body: {
    id_nguoidung: number,
    noi_dung: string,
    nguoi_gui: 'khach' | 'bot' | 'nhan_vien',
    trang_thai?: 'dang_cho' | 'da_tra_loi'
  }) {
    return this.chatSupportService.addMessage(body);
  }

  @Patch('mark-done')
  async markDone(@Body('id_nguoidung') id_nguoidung: number) {
    return this.chatSupportService.markDone(id_nguoidung);
  }
}
