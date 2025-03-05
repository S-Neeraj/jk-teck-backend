export declare class FirebaseAuthService {
    constructor();
    verifyToken(token: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
}
