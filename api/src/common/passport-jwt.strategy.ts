/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/user/user.entity';
import { PayloadInterface } from './payload.interface';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'kumospace',
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userRepository.findOneBy({
      id: payload.sub,
    });

    if (user) {
      const { salt, password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
}
