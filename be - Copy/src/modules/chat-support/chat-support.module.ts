import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSupportService } from './chat-support.service';
import { ChatSupportController } from './chat-support.controller';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatSupportGateway } from './chat-support.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatSupportController],
  providers: [ChatSupportService, ChatSupportGateway],
})
export class ChatSupportModule {}
