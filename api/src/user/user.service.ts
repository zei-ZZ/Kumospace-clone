/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSubscribeDto } from './user.subscribe.dto';
import { LoginCredentialsDto } from './user.login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async passwordHash(user: User) {
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    return user;
  }

  async register(userData: UserSubscribeDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (existingUser) {
      throw new ConflictException('Cet e-mail est déjà utilisé');
    }
    const user = this.userRepository.create({
      ...userData,
    });

    user.ImageProfile = '';
    await this.passwordHash(user);
    try {
      await this.userRepository.save(user);
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };
      const jwt = this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } catch (error) {
      throw new HttpException(
        'Error during registration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .getOne();
    if (!user) throw new NotFoundException('Compte inexistant');
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };
      const jwt = this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } else {
      throw new NotFoundException('password erroné');
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }
}
