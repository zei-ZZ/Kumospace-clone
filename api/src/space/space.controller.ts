import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SpaceService } from './space.service';
import { Space } from './space.entity';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { User as UserEntity } from '../user/user.entity';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() space : Space, @User() user: UserEntity) {
    //return this.spaceService.createSpace(space, user.id);
  }
}
