import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        privateKey: readFileSync(process.env.JWT_PRIVATE_KEY || '', 'utf8').replace(/\\n/g, '\n'),
        publicKey: readFileSync(process.env.JWT_PUBLIC_KEY || '', 'utf8').replace(/\\n/g, '\n'),
        signOptions: { algorithm: 'RS256', expiresIn: '1h' },
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
