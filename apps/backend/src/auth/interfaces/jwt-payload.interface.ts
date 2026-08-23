import { Peran } from '../../../generated/prisma/client';


export interface JwtPayload {
  sub: string;
  email: string;
  peran: Peran;
}
