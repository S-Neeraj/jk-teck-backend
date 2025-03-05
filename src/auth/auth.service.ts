import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  async validateFirebaseToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }

  async login(token: string) {
    try {
      const user = await this.validateFirebaseToken(token);
      const payload = { uid: user.uid, email: user.email };

      const privateKey = readFileSync(process.env.JWT_PRIVATE_KEY || '', 'utf8').replace(/\\n/g, '\n');

      const accessToken = this.jwtService.sign(payload, {
        privateKey,
        algorithm: 'RS256',
      });

      return { accessToken };
    } catch (error) {
      console.error('Login error:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
