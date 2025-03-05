import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token not found');
    }

    const token = authHeader.split(' ')[1];

    try {
      const publicKey = readFileSync(
        process.env.JWT_PUBLIC_KEY || '',
        'utf8',
      ).replace(/\\n/g, '\n');

      const user = this.jwtService.verify(token, {
        publicKey,
        algorithms: ['RS256'],
      });

      request.user = user;
      return true;
    } catch (error) {
      console.error('JWT Verification Failed::::==', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
