'use client';
import * as z from 'zod';

export const SignupValidation = z.object({
  username: z
    .string()
    .min(4, { message: 'Too short' })
    .max(15, { message: 'Too long' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(25, { message: 'Password must be no more than 8 characters.' }),
});
