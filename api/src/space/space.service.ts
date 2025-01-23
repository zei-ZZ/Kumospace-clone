/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { SpaceDto } from './space.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSpace(entity: SpaceDto, userid): Promise<Space> {
    const user = await this.userRepository.findOneBy({ id: userid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    entity.user = user;
    entity.key = uuidv4();
    const space = this.spaceRepository.create(entity);
    const newSpace = await this.spaceRepository.save(space);
    return newSpace;
  }

  async findOne(id): Promise<Space> {
    const space = await this.spaceRepository
      .createQueryBuilder('space')
      .leftJoinAndSelect('space.user', 'user')
      .where('space.id = :id', { id })
      .getOne();
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

  async findByUser(userId: string) {
    return await this.spaceRepository
      .createQueryBuilder('space')
      .leftJoinAndSelect('space.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findByKey(key: string) {
    return await this.spaceRepository
      .createQueryBuilder('space')
      .leftJoinAndSelect('space.user', 'user')
      .where('space.key = :key', { key })
      .getOne();
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.spaceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('entity Not Found');
    }
    return result;
  }
}
