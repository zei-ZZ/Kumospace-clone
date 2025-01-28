import { Space } from "./space";

export class User {
  username: string = '';
  email: string = '';
  password: string = '';
}

export class UserCredentials {
  email: string = '';
  password: string = '';
}

export class UserAuth {
  id: string = '';
  token: string = '';
}

export class UserDto {
  id: string = '';
  username: string = '';
  email: string = '';
  imageProfile: string = '';
  spaces: Space[] = [];
}
