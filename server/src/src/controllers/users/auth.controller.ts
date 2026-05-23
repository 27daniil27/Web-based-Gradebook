import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from '../../services/users/auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('api/auth/:id')
    async getHello(@Param('id') id: string) {
        const numericId = parseInt(id, 10);
        return this.authService.getHelloWithId(numericId);
    }
}