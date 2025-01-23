/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSpace(entity: Space, userid): Promise<Space> {
    const user = await this.userRepository.findOneBy({ id: userid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    entity.user = user;
    const space = this.spaceRepository.create(entity);
    const newSpace = await this.spaceRepository.save(space);
    return newSpace;
  }

  async findOne(id): Promise<Space> {
    const space = await this.spaceRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.user', 'user')
      .where('meal.id = :id', { id })
      .getOne();
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

  async findByUser(userId: string) {
    return await this.spaceRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.spaceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('entity Not Found');
    }
    return result;
  }
}
