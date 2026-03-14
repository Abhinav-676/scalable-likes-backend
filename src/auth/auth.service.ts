import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly users: {
    id: number;
    name: string;
    email: string;
    password: string;
  }[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.conf_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const exists = this.users.find((u) => u.email === dto.email);
    if (exists) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = {
      id: this.users.length + 1,
      name: dto.name.trim(),
      email: dto.email.toLowerCase(),
      password: hashedPassword,
    };
    this.users.push(user);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Registration successful',
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.email === dto.email.toLowerCase());

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}