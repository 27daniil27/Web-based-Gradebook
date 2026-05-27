import { AuthService } from '../../services/users/auth.service';
import express from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    getHello(request: express.Request, body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
