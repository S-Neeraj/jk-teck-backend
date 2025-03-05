"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const jwt_1 = require("@nestjs/jwt");
const fs_1 = require("fs");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }
    async validateFirebaseToken(token) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Firebase Token');
        }
    }
    async login(token) {
        try {
            const user = await this.validateFirebaseToken(token);
            const payload = { uid: user.uid, email: user.email };
            const privateKey = (0, fs_1.readFileSync)(process.env.JWT_PRIVATE_KEY || '', 'utf8');
            if (!privateKey) {
                throw new Error('JWT_PRIVATE_KEY is missing or empty');
            }
            const accessToken = this.jwtService.sign(payload, {
                secret: privateKey,
                algorithm: 'RS256',
            });
            return { accessToken };
        }
        catch (error) {
            console.error('Login error:', error.message);
            throw new Error('Authentication failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map