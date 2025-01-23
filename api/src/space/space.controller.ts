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
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { SpaceDto } from './space.dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { space: SpaceDto; userId: string }) {
    const { space, userId } = body;
    return this.spaceService.createSpace(space, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.spaceService.findByKey(key);
  }

  @Get('user/:userid')
  findByUser(@Param('userid') userid: string) {
    return this.spaceService.findByUser(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: { userId: string }) {
    const { userId } = body;
    const space = await this.spaceService.findOne(id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    if (userId !== space.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to delete this space',
      );
    }
    return this.spaceService.remove(id);
  }
}
