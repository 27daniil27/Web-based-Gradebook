import { AuthRepository } from '../../repositories/users/auth.repository';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private authRepository;
    private jwtService;
    private readonly logger;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    signIn(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
