import { Test, TestingModule } from '@nestjs/testing';
import { SignalingGateway } from './signaling.gateway';

describe('ChatGateway', () => {
  let gateway: SignalingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalingGateway],
    }).compile();

    gateway = module.get<SignalingGateway>(SignalingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
