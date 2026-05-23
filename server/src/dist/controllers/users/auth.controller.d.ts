import { AuthService } from '../../services/users/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getHello(id: string): Promise<import("../../entities/user.entity").User | null>;
}
