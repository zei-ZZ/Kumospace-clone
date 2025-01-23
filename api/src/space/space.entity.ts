import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  key: string;

  @Column('int', { default: 5 })
  capacity: number;

  @ManyToOne(() => User, (user) => user.spaces, { onDelete: 'CASCADE' })
  user: User;
}
