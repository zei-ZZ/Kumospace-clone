/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from 'src/common/passport-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'kumospace',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MulterModule.register({
      dest: 'public/uploads/user',
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService, JwtStrategy],
})
export class UserModule {}
