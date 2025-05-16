import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSupportService } from './chat-support.service';
import { ChatSupportController } from './chat-support.controller';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatSupportController],
  providers: [ChatSupportService],
})
export class ChatSupportModule {}
