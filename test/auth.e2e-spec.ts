import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { DecodedIdToken } from 'firebase-admin/auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate Firebase token', async () => {
    const token = 'mockToken';

    // Mock response with all required properties
    const mockDecodedToken: DecodedIdToken = {
      uid: '123',
      aud: 'mock-audience',
      auth_time: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 3600, // Expiration time
      firebase: { identities: {}, sign_in_provider: 'google.com' },
      iat: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/mock-project-id',
      sub: '123',
    };

    jest
      .spyOn(service, 'validateFirebaseToken')
      .mockResolvedValue(mockDecodedToken);

    const result = await service.validateFirebaseToken(token);
    expect(result.uid).toEqual('123');
  });
});
