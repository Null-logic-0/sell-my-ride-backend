import { Role } from '../enums/role.enum';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
  tokenVersion: number;
  googleId?: string;
}
