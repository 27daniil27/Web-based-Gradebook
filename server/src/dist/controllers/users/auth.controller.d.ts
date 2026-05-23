import { AuthService } from '../../services/users/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getHello(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
