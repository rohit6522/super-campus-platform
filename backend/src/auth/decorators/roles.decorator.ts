import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);