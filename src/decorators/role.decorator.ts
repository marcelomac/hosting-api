import { SetMetadata } from '@nestjs/common';

/**
 * SetMetadata: This is a built-in NestJS decorator that allows you to assign metadata
 * to a class, method, or property.
 */
export const Role = (role: string) => SetMetadata('role', role);
