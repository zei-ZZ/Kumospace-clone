/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSubscribeDto } from './user.subscribe.dto';
import { LoginCredentialsDto } from './user.login.dto';
import { extname } from 'path';
import { createReadStream, createWriteStream } from 'fs';

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
        msg: 'register success',
        user: {
          id: user.id,
          token: jwt,
        },
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
    if (!user) throw new NotFoundException('Account not found');
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };
      const jwt = this.jwtService.sign(payload);
      return {
        msg: 'login success',
        user: {
          id: user.id,
          token: jwt,
        },
      };
    } else {
      throw new NotFoundException('wrong password');
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Aucun fichier trouvé');
    }
    const fileName = `${Date.now()}${extname(file.originalname)}`;
    const uploadPath = `public/uploads/${destination}/${fileName}`;
    const reader = createReadStream(file.path);
    const writer = createWriteStream(uploadPath);
    await new Promise<void>((resolve, reject) => {
      reader.pipe(writer);
      writer.on('finish', () => resolve());
      writer.on('error', reject);
    });
    return fileName;
  }

  async update(id: string, updateDto: DeepPartial<User>): Promise<User> {
    const entity = await this.userRepository.preload({
      id,
      ...updateDto,
    });
    if (!entity) {
      throw new NotFoundException('entity Not Found');
    }
    return this.userRepository.save(entity);
  }
  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!user) {
        return { valid: false };
      }
      return {
        valid: true,
        userId: decoded.sub,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.spaces', 'space')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
