import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import LoginInput from './dto/login-input.dto';
import LoginResponse from './dto/login-response.dto';
import RegisterInput from './dto/register-input.dto';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const matched = compareSync(pass, user.password);

      if (matched) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: LoginInput): Promise<LoginResponse> {
    try {
      const { username, password } = user;
      const payload = await this.validateUser(username, password);

      if (!payload) {
        throw new HttpException(
          'Invalid username or password',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        accessToken: this.jwtService.sign({ username, password }),
      };
    } catch (error) {
      return error;
    }
  }

  async register(registerInput: RegisterInput) {
    try {
      const { username, password } = registerInput;
      const user = await this.usersService.create({
        username,
        password,
      });

      return user;
    } catch (error) {
      return error;
    }
  }
}
