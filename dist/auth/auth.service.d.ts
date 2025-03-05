import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    validateFirebaseToken(token: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
    login(token: string): Promise<{
        accessToken: string;
    }>;
}
