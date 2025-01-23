/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserSubscribeDto } from './user.subscribe.dto';
import { LoginCredentialsDto } from './user.login.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileInterceptor } from 'src/common/file.interceptor';
import { UpdateUserDto } from './update.user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post('register')
  register(@Body() userData: UserSubscribeDto) {
    return this.userService.register(userData);
  }

  @Post('login')
  login(@Body() credentials: LoginCredentialsDto) {
    return this.userService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/photo')
  @UseInterceptors(
    FileInterceptor('photo'),
    new CustomFileInterceptor(['image/png', 'image/jpeg'], 1000000),
  )
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const user = req.user;
    const fileName = await this.userService.uploadFile(file, 'user');
    const updateuser = new UpdateUserDto();
    updateuser.ImageProfile = fileName;
    await this.userService.update(user.id, updateuser);
    return { fileName };
  }
}
