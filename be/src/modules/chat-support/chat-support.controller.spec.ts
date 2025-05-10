import { Test, TestingModule } from '@nestjs/testing';
import { ChatSupportController } from './chat-support.controller';

describe('ChatSupportController', () => {
  let controller: ChatSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatSupportController],
    }).compile();

    controller = module.get<ChatSupportController>(ChatSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
