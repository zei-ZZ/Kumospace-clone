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

  @Get('user/:userid')
  findByUser(@Param('userid') userid: string) {
    return this.spaceService.findByUser(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: { userId: string }) {
    const { userId } = body;
    const meal = await this.spaceService.findOne(id);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    if (userId !== meal.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to delete this meal',
      );
    }
    return this.spaceService.remove(id);
  }
}
