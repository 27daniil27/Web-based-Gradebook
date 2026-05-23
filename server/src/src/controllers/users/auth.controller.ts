import {Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from '../../services/users/auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/api/auth/login')
    async getHello(@Body() body :{
        email: string,
        password: string
    }) :Promise<{ access_token: string }> {
        return this.authService.signIn(body);
    }
}