import { User } from './user';

export interface SignInResponse {
  user: User;
  token: string;
}
