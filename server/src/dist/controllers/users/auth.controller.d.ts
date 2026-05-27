import { AuthService } from '../../services/users/auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    getHello(request: any, body: {
        email: string;
        password: string;
    }, response: any): Promise<{
        success: boolean;
    }>;
    refresh(request: any, response: any): Promise<{
        success: boolean;
    }>;
}
