import { Controller, Get, Query } from '@nestjs/common';
import { ChatSupportService } from './chat-support.service';

@Controller('chat-support')
export class ChatSupportController {
  constructor(private readonly chatSupportService: ChatSupportService) {}

  @Get()
  findAll() {
    return this.chatSupportService.findAll();
  }

  @Get('by-user')
  findByUser(@Query('id_nguoi_dung') id: number) {
    return this.chatSupportService.findByUser(Number(id));
  }
}
