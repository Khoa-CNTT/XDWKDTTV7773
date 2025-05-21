import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
  namespace: '/',
})
export class ChatSupportGateway {
  @WebSocketServer()
  server: Server;

  // Gửi tin nhắn từ FE -> broadcast cho tất cả FE đã kết nối
  @SubscribeMessage('send_message')
  handleSendMessage(@MessageBody() message: any) {
    this.server.emit('receive_message', message);
  }
}
