import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { UserDto } from 'src/dtos/auth.dto';

@Controller('auth')
export class AuthController {
    @Post('register')
    async register(@Body() body: UserDto) {

    }
}
