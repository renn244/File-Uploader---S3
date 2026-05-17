import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    // the purpose is to sync clerk user db to our own database for relationship purposes
    @Post()
    async createPostWebHook(@Req() req: Request, @Body() body: any) {
        return this.authService.createPostWebHook(req, body);
    }
}
