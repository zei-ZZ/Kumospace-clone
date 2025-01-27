import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Space, User])],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
