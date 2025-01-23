import { Timestamp } from 'src/common/timestamp.entity';
import { Space } from 'src/space/space.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  @Column('text')
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  ImageProfile: string;

  @OneToMany(() => Space, (space) => space.user)
  spaces: Space[];

  @Column()
  salt: string;
}
