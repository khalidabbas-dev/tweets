import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginInput from './dto/login-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() user: LoginInput) {
    return this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() user: LoginInput) {
    return this.authService.register(user);
  }
}
