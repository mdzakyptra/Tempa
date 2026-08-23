import { SetMetadata } from '@nestjs/common';
import { Peran } from '../../../generated/prisma/client';


export const ROLES_KEY = 'roles';

//<---------- Roles -------------->
export const Roles = (...roles: Peran[]) => SetMetadata(ROLES_KEY, roles);
