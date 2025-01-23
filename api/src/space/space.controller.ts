/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
  create(@Body() space: Space, @User() user: UserEntity) {
    return this.spaceService.createSpace(space, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Get('user/:userid')
  findByUser(@Param('userid') userid: string) {
    return this.spaceService.findByUser(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user) {
    const meal = await this.spaceService.findOne(id);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    if (user.id !== meal.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to delete this meal',
      );
    }
    return this.spaceService.remove(id);
  }
}
