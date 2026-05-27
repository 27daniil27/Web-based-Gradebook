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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_repository_1 = require("../../repositories/users/auth.repository");
const jwt_1 = require("@nestjs/jwt");
let AuthService = AuthService_1 = class AuthService {
    authRepository;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async signIn(body) {
        this.logger.log('Method sign in with email and password was called');
        const user = await this.authRepository.findByEmail(body.email);
        if (!user) {
            this.logger.log('User does not exist');
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.password !== body.password) {
            this.logger.log('User does not match password');
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.full_name,
        };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '2h',
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '30d',
        });
        return { access_token, refresh_token };
    }
    async refreshSession(refreshToken) {
        if (!refreshToken) {
            this.logger.log('Refresh token is missing');
            throw new common_1.UnauthorizedException('Refresh token missing');
        }
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const accessToken = await this.jwtService.signAsync({
                id: payload.id,
                email: payload.email,
                role: payload.role,
                name: payload.name,
            }, { expiresIn: '2h' });
            return { accessToken };
        }
        catch (err) {
            this.logger.warn('Invalid refresh token');
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map