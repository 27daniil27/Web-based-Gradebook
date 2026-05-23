import {Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthRepository } from '../../repositories/users/auth.repository';
import {JwtService} from "@nestjs/jwt";
import {User} from "../../entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) {}

    async signIn( body: {
        email: string,
        password: string
    } ): Promise<{ access_token: string }> {
        const user: User|null = await this.authRepository.findByEmail(body.email);
``
        if (!user) {
            throw new UnauthorizedException( 'User not found', );
        }
        if (user.password !== body.password) {
            throw new UnauthorizedException( 'Invalid password', );
        }

        const payload = {
            id: user.id, email: user.email, role: user.role,
        };

        return { access_token: await this.jwtService.signAsync(payload), };
    }
}