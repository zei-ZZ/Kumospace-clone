import { User } from 'src/user/user.entity';

export class SpaceDto {
  name: string;
  capacity: number;
  user: User;
  key: string;
}
